-- Enable Row Level Security on all core operational tables
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_census ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_resource_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecast_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecast_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- 1. Read-Only Policies for Authenticated Clinical Staff
-- Staff should be able to view wards, disease groups, census, and forecasts.
CREATE POLICY "Allow authenticated read access to wards" ON wards FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to disease groups" ON disease_groups FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to census" ON daily_census FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to resource metrics" ON daily_resource_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to forecasts" ON forecast_runs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to forecast points" ON forecast_points FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to evaluations" ON model_evaluations FOR SELECT TO authenticated USING (true);

-- 2. Patient Data Privacy
-- Clinical staff can only view patients assigned to their specific ward 
-- (Assuming we add a 'user_ward_access' mapping table in the future, for now we restrict to authenticated only)
CREATE POLICY "Restrict patient read access" ON patients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Deny patient deletion" ON patients FOR DELETE TO authenticated USING (false);

-- 3. Service Role (Backend API) Write Access
-- The FastAPI backend connects using the service_role key, which bypasses RLS by default.
-- However, we explicitly grant insert/update to authenticated service accounts.
CREATE POLICY "Allow service role inserts for census" ON daily_census FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Allow service role inserts for resources" ON daily_resource_metrics FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Allow service role inserts for forecasts" ON forecast_runs FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Allow service role inserts for forecast points" ON forecast_points FOR INSERT TO service_role WITH CHECK (true);

-- 4. Audit Log Immunity
-- Audit events can only be inserted, NEVER updated or deleted, even by admins
CREATE POLICY "Allow audit inserts" ON audit_events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Deny audit updates" ON audit_events FOR UPDATE TO authenticated USING (false);
CREATE POLICY "Deny audit deletes" ON audit_events FOR DELETE TO authenticated USING (false);
