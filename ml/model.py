import pandas as pd
import numpy as np
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib
import json
import os

def train_and_evaluate(data_path="synthetic_hospital_data.csv", horizon=7):
    # 1. Load Data
    if not os.path.exists(data_path):
        print("Data file not found. Run synthetic_data.py first.")
        return
        
    df = pd.read_csv(data_path)
    df['admitted_at'] = pd.to_datetime(df['admitted_at'])
    df['date'] = df['admitted_at'].dt.date
    
    # Aggregate daily admissions
    daily_adm = df.groupby('date').size().reset_index(name='admissions')
    daily_adm['date'] = pd.to_datetime(daily_adm['date'])
    daily_adm = daily_adm.sort_values('date').set_index('date')
    
    # 2. Feature Engineering
    # Add lags and rolling features
    for i in [1, 2, 3, 7, 14]:
        daily_adm[f'lag_{i}'] = daily_adm['admissions'].shift(i)
    
    daily_adm['rolling_mean_7'] = daily_adm['admissions'].shift(1).rolling(window=7).mean()
    daily_adm['day_of_week'] = daily_adm.index.dayofweek
    
    # Create target (admissions N days in future)
    daily_adm[f'target_{horizon}d'] = daily_adm['admissions'].shift(-horizon)
    
    daily_adm = daily_adm.dropna()
    
    # 3. Train-Test Split (Chronological)
    split_idx = int(len(daily_adm) * 0.8)
    train = daily_adm.iloc[:split_idx]
    test = daily_adm.iloc[split_idx:]
    
    features = [c for c in daily_adm.columns if c not in ['admissions', f'target_{horizon}d']]
    
    X_train, y_train = train[features], train[f'target_{horizon}d']
    X_test, y_test = test[features], test[f'target_{horizon}d']
    
    # 4. Train Model
    # Using HistGradientBoostingRegressor which natively handles missing values and uses quantile loss for intervals
    # We train a mean estimator and quantile estimators
    
    model_mean = HistGradientBoostingRegressor(loss='squared_error', random_state=42)
    model_mean.fit(X_train, y_train)
    
    # Quantile models for 80% interval (10th and 90th percentiles)
    model_lower = HistGradientBoostingRegressor(loss='quantile', quantile=0.1, random_state=42)
    model_lower.fit(X_train, y_train)
    
    model_upper = HistGradientBoostingRegressor(loss='quantile', quantile=0.9, random_state=42)
    model_upper.fit(X_train, y_train)
    
    # 5. Evaluate
    preds = model_mean.predict(X_test)
    preds_lower = model_lower.predict(X_test)
    preds_upper = model_upper.predict(X_test)
    
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    
    coverage = np.mean((y_test >= preds_lower) & (y_test <= preds_upper))
    
    evaluation = {
        "model_version": "v1.0-histgradboost",
        "target": "daily_admissions",
        "horizon": horizon,
        "sample_count": len(test),
        "MAE": round(mae, 4),
        "RMSE": round(rmse, 4),
        "interval_coverage": round(coverage, 4)
    }
    
    print("Evaluation Results:")
    print(json.dumps(evaluation, indent=2))
    
    # 6. Save Model
    joblib.dump({
        'mean': model_mean,
        'lower': model_lower,
        'upper': model_upper,
        'features': features
    }, f'model_horizon_{horizon}d.joblib')
    
    with open(f'evaluation_{horizon}d.json', 'w') as f:
        json.dump(evaluation, f, indent=2)

if __name__ == "__main__":
    train_and_evaluate()
