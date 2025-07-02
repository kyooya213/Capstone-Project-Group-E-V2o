/*
  # Create Reviews and Rating System

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `order_id` (uuid, references orders)
      - `customer_id` (uuid, references users)
      - `overall_rating` (integer 1-5)
      - `quality_rating` (integer 1-5)
      - `service_rating` (integer 1-5)
      - `delivery_rating` (integer 1-5)
      - `review_text` (text)
      - `photos` (text array)
      - `is_approved` (boolean)
      - `staff_response` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on reviews table
    - Add policies for customers to create reviews for their orders
    - Add policies for public read access to approved reviews
    - Add policies for admin management
*/

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) NOT NULL,
  customer_id uuid REFERENCES users(id) NOT NULL,
  overall_rating integer NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  quality_rating integer CHECK (quality_rating >= 1 AND quality_rating <= 5),
  service_rating integer CHECK (service_rating >= 1 AND service_rating <= 5),
  delivery_rating integer CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  review_text text,
  photos text[],
  is_approved boolean DEFAULT false,
  staff_response text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(order_id, customer_id)
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Customers can create reviews for their orders"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM orders WHERE id = order_id AND customer_id = auth.uid() AND status = 'completed'
    )
  );

CREATE POLICY "Customers can read their own reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Anyone can read approved reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (is_approved = true);

CREATE POLICY "Admin can manage all reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));