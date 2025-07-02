/*
  # Create Reports and Audit Trail System

  1. New Tables
    - `sales_reports`
      - `id` (uuid, primary key)
      - `report_type` (text) - daily, weekly, monthly
      - `start_date` (date)
      - `end_date` (date)
      - `total_orders` (integer)
      - `total_revenue` (numeric)
      - `total_customers` (integer)
      - `popular_materials` (jsonb)
      - `payment_methods_breakdown` (jsonb)
      - `generated_by` (uuid, references users)
      - `created_at` (timestamp)
    
    - `audit_trail`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `action` (text)
      - `table_name` (text)
      - `record_id` (uuid)
      - `old_values` (jsonb)
      - `new_values` (jsonb)
      - `ip_address` (inet)
      - `user_agent` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Create sales_reports table
CREATE TABLE IF NOT EXISTS sales_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type text NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_orders integer DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  total_customers integer DEFAULT 0,
  popular_materials jsonb DEFAULT '[]'::jsonb,
  payment_methods_breakdown jsonb DEFAULT '{}'::jsonb,
  top_templates jsonb DEFAULT '[]'::jsonb,
  generated_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create audit_trail table
CREATE TABLE IF NOT EXISTS audit_trail (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sales_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

-- Policies for sales_reports
CREATE POLICY "Admin can manage sales reports"
  ON sales_reports
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));

-- Policies for audit_trail
CREATE POLICY "Admin can view audit trail"
  ON audit_trail
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));

CREATE POLICY "System can insert audit logs"
  ON audit_trail
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to automatically generate audit logs
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_trail (user_id, action, table_name, record_id, new_values)
    VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_trail (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_trail (user_id, action, table_name, record_id, old_values)
    VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for audit trail
CREATE TRIGGER audit_users_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_orders_trigger
  AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_payments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();