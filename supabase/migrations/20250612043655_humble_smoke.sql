/*
  # Create Payment Management System

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `order_id` (uuid, references orders)
      - `amount` (decimal)
      - `payment_method` (text)
      - `payment_reference` (text)
      - `payment_status` (text)
      - `gateway_response` (jsonb)
      - `processed_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on payments table
    - Add policies for customers to view their payments
    - Add policies for admin management
*/

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) NOT NULL,
  amount decimal NOT NULL CHECK (amount > 0),
  payment_method text NOT NULL,
  payment_reference text,
  payment_status text NOT NULL CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  gateway_response jsonb,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies for payments
CREATE POLICY "Customers can view their payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders WHERE id = order_id AND customer_id = auth.uid()
  ));

CREATE POLICY "Admin can manage all payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));

CREATE POLICY "System can create payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders WHERE id = order_id AND customer_id = auth.uid()
  ));