/*
  # Create Templates Management System

  1. New Tables
    - `templates`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `preview_url` (text)
      - `file_url` (text)
      - `price_modifier` (decimal)
      - `is_active` (boolean)
      - `rating_average` (decimal)
      - `usage_count` (integer)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on templates table
    - Add policies for public read access to active templates
    - Add policies for admin management
*/

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  preview_url text,
  file_url text,
  price_modifier decimal DEFAULT 0,
  is_active boolean DEFAULT true,
  rating_average decimal DEFAULT 0 CHECK (rating_average >= 0 AND rating_average <= 5),
  usage_count integer DEFAULT 0,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Policies for templates
CREATE POLICY "Anyone can view active templates"
  ON templates
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admin can manage templates"
  ON templates
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));

-- Insert sample templates
INSERT INTO templates (name, description, category, preview_url, price_modifier, is_active) VALUES
('Business Grand Opening', 'Professional grand opening banner template', 'Business', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg', 0, true),
('Birthday Celebration', 'Colorful birthday party banner design', 'Events', 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg', 0, true),
('Sale Promotion', 'Eye-catching sale promotion banner', 'Promotions', 'https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg', 50, true),
('Wedding Anniversary', 'Elegant wedding anniversary banner', 'Events', 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg', 0, true),
('Real Estate', 'Professional real estate signage template', 'Business', 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg', 25, true);