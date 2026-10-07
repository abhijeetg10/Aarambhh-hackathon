# BedFlow 
**ML-Powered Hospital Bed, Disease-Group & Resource Forecasting Platform**

BedFlow is an advanced, ML-driven hospital capacity forecasting and operational management dashboard designed to provide actionable decision support.

## Overview
- **Frontend**: React + Vite + TypeScript, tailwindcss, shadcn/ui. 
- **Backend**: Supabase PostgreSQL with RLS, Python FastAPI ML service.
- **ML**: Scikit-Learn (HistGradientBoostingRegressor) for unconstrained capacity demand and operational gap prediction.
- **Dataset**: A fully reproducible **synthetic hospital event simulator** is included in `ml/synthetic_data.py`. Please see `docs/DATASET_CARD.md` for dataset information.

## Project Structure
- `/frontend`: Vite React App
- `/backend`: Python FastAPI service for predictions and simulation logic
- `/ml`: Model training, data simulation, evaluation scripts
- `/supabase`: SQL migration scripts
- `/docs`: Dataset cards and evaluations

## Getting Started

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend & ML
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Unix: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

To run the synthetic data generation and ML training pipeline:
```bash
cd ml
python synthetic_data.py
python model.py
```

### 3. Database
We use Supabase. You can initialize a Supabase project locally and run the migrations:
```bash
npx supabase start
npx supabase db push
```
Or you can manually run the SQL script located in `supabase/migrations/20261007000000_bedflow_schema.sql` against any Postgres instance.

## Evaluation
The synthetic data is purely for demonstration. Model performance metrics printed by `model.py` evaluate the model's ability to learn the synthetic distributions (e.g., length of stay patterns and seasonal surges), not real-world clinical behavior.
