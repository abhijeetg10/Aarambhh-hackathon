from fastapi import FastAPI, Depends, HTTPException, Security, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
import datetime
import json
import os
import joblib
import pandas as pd
import numpy as np
import subprocess

app = FastAPI(title="BedFlow API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.datetime.now().isoformat()}

class ForecastRequest(BaseModel):
    horizon: int = 7
    data_source: str = "synthetic"

@app.post("/forecast")
def generate_forecast(req: ForecastRequest):
    model_path = f"model_horizon_{req.horizon}d.joblib"
    data_path = "synthetic_hospital_data.csv"
    
    if not os.path.exists(model_path) or not os.path.exists(data_path):
        # Fallback to mock data if model not trained yet
        return {"status": "error", "message": "Model not trained yet."}
        
    try:
        model_dict = joblib.load(model_path)
        model_mean = model_dict['mean']
        model_lower = model_dict['lower']
        model_upper = model_dict['upper']
        features = model_dict['features']
        
        # Load historical data to build latest features
        df = pd.read_csv(data_path)
        df['admitted_at'] = pd.to_datetime(df['admitted_at'])
        df['date'] = df['admitted_at'].dt.date
        daily_adm = df.groupby('date').size().reset_index(name='admissions')
        daily_adm['date'] = pd.to_datetime(daily_adm['date'])
        daily_adm = daily_adm.sort_values('date').set_index('date')
        
        # Build features for the current day
        current_features = {}
        for i in [1, 2, 3, 7, 14]:
            current_features[f'lag_{i}'] = daily_adm['admissions'].iloc[-i] if len(daily_adm) >= i else 0
            
        current_features['rolling_mean_7'] = daily_adm['admissions'].iloc[-7:].mean() if len(daily_adm) >= 7 else 0
        current_features['day_of_week'] = (daily_adm.index[-1] + datetime.timedelta(days=1)).dayofweek
        
        X_pred = pd.DataFrame([current_features])[features]
        
        pred_mean = max(0, int(model_mean.predict(X_pred)[0]))
        pred_lower = max(0, int(model_lower.predict(X_pred)[0]))
        pred_upper = max(0, int(model_upper.predict(X_pred)[0]))
        
        # Get historical data for chart
        history = []
        for i in range(7):
            date_idx = -7 + i
            history.append({
                "date": daily_adm.index[date_idx].strftime("%b %d"),
                "actual": int(daily_adm['admissions'].iloc[date_idx]),
                "predicted": None,
                "range": None
            })
            
        # Add future points (simplification: we just use the 1 point for horizon=7 and interpolate)
        # For a true multi-step, we'd predict 1..7 days
        # We will mock the intermediate days for the UI
        future = []
        today = daily_adm.index[-1]
        
        # Mocking interpolation to the prediction
        last_actual = history[-1]['actual']
        step_mean = (pred_mean - last_actual) / req.horizon
        
        for i in range(1, req.horizon + 1):
            target_date = today + datetime.timedelta(days=i)
            is_target = i == req.horizon
            
            p_mean = int(last_actual + (step_mean * i))
            
            # Widen bounds as we go further
            spread = (pred_upper - pred_lower) * (i / req.horizon)
            p_lower = int(p_mean - (spread/2))
            p_upper = int(p_mean + (spread/2))
            
            future.append({
                "date": target_date.strftime("%b %d"),
                "actual": None,
                "predicted": p_mean,
                "range": [p_lower, p_upper],
                "lower": p_lower,
                "upper": p_upper
            })
            
        # Join history and future
        chart_data = history + future
        
        return {
            "status": "success", 
            "horizon": req.horizon, 
            "prediction": pred_mean,
            "prediction_interval": [pred_lower, pred_upper],
            "chart_data": chart_data
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/model-evaluations")
def get_model_evaluations():
    eval_path = "evaluation_7d.json"
    if os.path.exists(eval_path):
        with open(eval_path, "r") as f:
            return [json.load(f)]
    return []

def run_ml_pipeline_task():
    try:
        # Generate data
        import sys
        subprocess.run([sys.executable, "ml/synthetic_data.py"], check=True)
        # Train model
        subprocess.run([sys.executable, "ml/model.py"], check=True)
    except Exception as e:
        print(f"Pipeline error: {e}")

@app.post("/admin/train")
def train_model(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_ml_pipeline_task)
    return {"status": "training_started", "message": "ML pipeline running in background."}
