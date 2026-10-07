import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Configuration
NUM_PATIENTS = 2000
START_DATE = datetime(2023, 1, 1)
END_DATE = datetime(2024, 1, 1)
WARDS = {
    'ICU': {'capacity': 12, 'type': 'icu'},
    'GEN_MED': {'capacity': 30, 'type': 'general'},
    'CARDIO': {'capacity': 20, 'type': 'general'},
    'ORTHO': {'capacity': 24, 'type': 'general'},
    'MATERNITY': {'capacity': 16, 'type': 'general'},
    'EMERGENCY_OBS': {'capacity': 18, 'type': 'observation'}
}
DISEASE_GROUPS = ['Respiratory', 'Cardiac', 'Trauma', 'Infectious', 'Neurological', 'Surgical']

def generate_synthetic_data(filepath="synthetic_hospital_data.csv"):
    np.random.seed(42)
    random.seed(42)
    
    events = []
    
    for i in range(NUM_PATIENTS):
        patient_id = f"MRN-{np.random.randint(1000, 99999)}"
        # Random admission date with seasonal trend (more respiratory in winter)
        day_offset = np.random.randint(0, (END_DATE - START_DATE).days)
        admit_date = START_DATE + timedelta(days=day_offset)
        
        disease = np.random.choice(DISEASE_GROUPS)
        
        # Length of stay depends on disease
        if disease == 'Respiratory':
            los = np.random.gamma(shape=2, scale=3)
        elif disease == 'Cardiac':
            los = np.random.gamma(shape=3, scale=2)
        else:
            los = np.random.gamma(shape=2, scale=2)
            
        los = max(1, int(los))
        discharge_date = admit_date + timedelta(days=los)
        
        # Assign ward
        if disease == 'Cardiac':
            ward = 'CARDIO'
        elif disease == 'Respiratory' and np.random.rand() > 0.8:
            ward = 'ICU'
        else:
            ward = np.random.choice(['GEN_MED', 'ORTHO', 'EMERGENCY_OBS'])
            
        exit_type = np.random.choice(['discharged', 'transferred_out', 'deceased'], p=[0.9, 0.05, 0.05])
        
        events.append({
            'patient_id': patient_id,
            'admitted_at': admit_date.isoformat(),
            'actual_exit_at': discharge_date.isoformat(),
            'exit_type': exit_type,
            'primary_disease_group': disease,
            'ward_id': ward,
            'length_of_stay_days': los
        })
        
    df = pd.DataFrame(events)
    df.sort_values('admitted_at', inplace=True)
    df.to_csv(filepath, index=False)
    print(f"Generated {len(df)} synthetic patient episodes at {filepath}")

if __name__ == "__main__":
    generate_synthetic_data()
