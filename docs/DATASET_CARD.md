# BedFlow Dataset Strategy

## Overview
For the purpose of this hackathon demonstration, this project employs a **reproducible synthetic hospital event simulator** to generate the necessary operational time-series data. 

**IMPORTANT**: All predictions and models trained on this data represent pipeline behavior and system architecture, NOT real clinical or hospital generalization. Do not interpret the test scores or model evaluations as real-hospital accuracy.

## Dataset Details
- **Source URL and publisher**: Locally Generated (Synthetic Data Simulator)
- **Version and download date**: Generated at runtime.
- **License and access requirements**: Open access (Synthetic). No access restrictions.
- **Unit of observation**: Patient episodes (admissions, transfers, discharges, resource utilization).
- **Time granularity and coverage**: Daily metrics, hourly level simulation of events covering a 1-year continuous series (including seasonal cycles).
- **Hospitals/wards represented**: 1 Simulated Hospital. 6 Wards (ICU: 12 beds, General Medicine: 30 beds, Cardiology: 20 beds, Orthopedics: 24 beds, Maternity: 16 beds, Emergency Observation: 18 beds). Total physical beds: 120.
- **Available fields**: 
  - Patient ID (synthetic MRN)
  - Admission timestamps
  - Ward movements & timestamps
  - Bed assignments
  - Discharge and exit timestamps (exit types: discharged, transferred_out, deceased)
  - Recorded disease group (primary)
  - Ventilator usage intervals
  - Oxygen support (count-based demand)
- **Missing fields**: N/A (Synthetic data generates required fields).
- **Inclusion/exclusion criteria**: Synthetic patients cover multiple simulated disease groups.
- **De-identification limitations**: N/A, all patients are entirely synthetic. No PHI exists.
- **Supported prediction targets**: 
  - Incoming admissions by ward
  - Disease-group admissions
  - Bed releases and transfers
  - ICU demand
  - Ventilator use demand
  - Oxygen-supported patient demand
  - Final operational bed availability and shortfall

## Usage Warning
This dataset is **synthetic** and designed purely to test the integration of the Machine Learning pipeline with the operational frontend/backend. 
- It exhibits basic calendar effects, demand surges, and capacity changes (e.g., maintenance outages).
- It must not be used for actual hospital operational planning or clinical decision support.
- Model performance metrics shown in the dashboard represent the model's ability to learn the synthetic generation rules, not clinical reality.
