-- BedFlow Initial Schema

CREATE TYPE role_type AS ENUM ('admin', 'bed_manager', 'ward_staff', 'analyst');
CREATE TYPE bed_status AS ENUM ('available', 'occupied', 'cleaning', 'maintenance');
CREATE TYPE exit_type_enum AS ENUM ('discharged', 'transferred_out', 'deceased');

CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'UTC'
);

CREATE TABLE profiles (
    user_id UUID PRIMARY KEY, -- References auth.users(id)
    hospital_id UUID REFERENCES hospitals(id),
    display_name TEXT NOT NULL,
    role role_type NOT NULL DEFAULT 'ward_staff'
);

CREATE TABLE wards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES hospitals(id) NOT NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    specialty TEXT,
    floor TEXT,
    physical_beds INT NOT NULL DEFAULT 0,
    staffed_beds INT NOT NULL DEFAULT 0,
    supports_isolation BOOLEAN NOT NULL DEFAULT false,
    active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE user_ward_assignments (
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    ward_id UUID REFERENCES wards(id) ON DELETE CASCADE,
    permissions TEXT,
    PRIMARY KEY (user_id, ward_id)
);

CREATE TABLE beds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id UUID REFERENCES wards(id) ON DELETE CASCADE NOT NULL,
    label TEXT NOT NULL,
    status bed_status NOT NULL DEFAULT 'available',
    isolation_capable BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (ward_id, label)
);

CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES hospitals(id) NOT NULL,
    mrn TEXT NOT NULL UNIQUE,
    dob DATE,
    gender TEXT
);

CREATE TABLE disease_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE patient_episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    admitted_at TIMESTAMPTZ NOT NULL,
    expected_discharge_at TIMESTAMPTZ,
    expected_discharge_recorded_at TIMESTAMPTZ,
    actual_exit_at TIMESTAMPTZ,
    exit_type exit_type_enum,
    admission_type TEXT,
    acuity TEXT,
    primary_disease_group_id UUID REFERENCES disease_groups(id)
);

CREATE TABLE patient_diagnoses (
    episode_id UUID REFERENCES patient_episodes(id) ON DELETE CASCADE,
    disease_group_id UUID REFERENCES disease_groups(id),
    is_primary BOOLEAN DEFAULT false,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (episode_id, disease_group_id)
);

CREATE TABLE bed_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id UUID REFERENCES patient_episodes(id) NOT NULL,
    bed_id UUID REFERENCES beds(id) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

-- Ensure only one active assignment per bed and episode
CREATE UNIQUE INDEX idx_active_bed ON bed_assignments (bed_id) WHERE ended_at IS NULL;
CREATE UNIQUE INDEX idx_active_episode ON bed_assignments (episode_id) WHERE ended_at IS NULL;

CREATE TABLE patient_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id UUID REFERENCES patient_episodes(id) NOT NULL,
    from_ward_id UUID REFERENCES wards(id),
    to_ward_id UUID REFERENCES wards(id) NOT NULL,
    transferred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE patient_resource_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id UUID REFERENCES patient_episodes(id) NOT NULL,
    resource_type TEXT NOT NULL,
    device_id TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    oxygen_flow_lpm DECIMAL(5,2)
);

CREATE TABLE resource_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id UUID REFERENCES wards(id) NOT NULL,
    resource_type TEXT NOT NULL,
    total_units INT NOT NULL DEFAULT 0,
    unavailable_units INT NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (total_units >= 0),
    CHECK (unavailable_units >= 0 AND unavailable_units <= total_units),
    UNIQUE (ward_id, resource_type)
);

CREATE TABLE daily_ward_metrics (
    date DATE NOT NULL,
    ward_id UUID REFERENCES wards(id) NOT NULL,
    admissions INT NOT NULL DEFAULT 0,
    discharges INT NOT NULL DEFAULT 0,
    transfers_in INT NOT NULL DEFAULT 0,
    transfers_out INT NOT NULL DEFAULT 0,
    occupancy INT NOT NULL DEFAULT 0,
    staffed_capacity INT NOT NULL DEFAULT 0,
    cleaning_beds INT NOT NULL DEFAULT 0,
    maintenance_beds INT NOT NULL DEFAULT 0,
    unmet_demand INT NOT NULL DEFAULT 0,
    source TEXT NOT NULL,
    PRIMARY KEY (date, ward_id)
);

CREATE TABLE daily_disease_metrics (
    date DATE NOT NULL,
    ward_id UUID REFERENCES wards(id) NOT NULL,
    disease_group_id UUID REFERENCES disease_groups(id) NOT NULL,
    admissions INT NOT NULL DEFAULT 0,
    occupancy INT NOT NULL DEFAULT 0,
    releases INT NOT NULL DEFAULT 0,
    icu_patients INT NOT NULL DEFAULT 0,
    ventilated_patients INT NOT NULL DEFAULT 0,
    oxygen_supported_patients INT NOT NULL DEFAULT 0,
    source TEXT NOT NULL,
    PRIMARY KEY (date, ward_id, disease_group_id)
);

CREATE TABLE daily_resource_metrics (
    date DATE NOT NULL,
    ward_id UUID REFERENCES wards(id) NOT NULL,
    ventilators_in_use INT NOT NULL DEFAULT 0,
    oxygen_supported_patients INT NOT NULL DEFAULT 0,
    measured_oxygen_volume_liters DECIMAL(10,2),
    source TEXT NOT NULL,
    PRIMARY KEY (date, ward_id)
);

CREATE TABLE forecast_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    origin_date DATE NOT NULL,
    training_cutoff DATE NOT NULL,
    model_version TEXT NOT NULL,
    horizon INT NOT NULL,
    data_source TEXT NOT NULL,
    status TEXT NOT NULL
);

CREATE TABLE forecast_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID REFERENCES forecast_runs(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    ward_id UUID REFERENCES wards(id) NOT NULL,
    disease_group_id UUID REFERENCES disease_groups(id),
    target TEXT NOT NULL,
    predicted_value DECIMAL(10,2) NOT NULL,
    lower_bound DECIMAL(10,2),
    upper_bound DECIMAL(10,2),
    interval_level DECIMAL(3,2),
    operational_capacity INT,
    unit TEXT,
    model_name TEXT
);

CREATE TABLE model_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_version TEXT NOT NULL,
    target TEXT NOT NULL,
    group_name TEXT,
    horizon INT,
    evaluation_period TEXT,
    sample_count INT,
    mae DECIMAL(10,4),
    rmse DECIMAL(10,4),
    baseline_mae DECIMAL(10,4),
    baseline_rmse DECIMAL(10,4),
    interval_coverage DECIMAL(5,4),
    interval_width DECIMAL(10,4),
    shortage_alert_precision DECIMAL(5,4),
    shortage_alert_recall DECIMAL(5,4)
);

CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID,
    action TEXT NOT NULL,
    entity_id UUID,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    operation_id TEXT
);
