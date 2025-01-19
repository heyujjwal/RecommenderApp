/*
  # Product Recommendation System Schema

  1. New Tables
    - `products`
      - Product information including name, price, and image
    - `user_activities`
      - Tracks user interactions with products
    - `recommendations`
      - Stores product recommendations for users
    - `discounts`
      - Configurable discount offers

  2. Security
    - Enable RLS on all tables
    - Add policies for secure data access
*/

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  category text,
  created_at timestamptz DEFAULT now()
);

-- User activities table
CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  product_id uuid REFERENCES products,
  activity_type text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  product_id uuid REFERENCES products,
  score decimal(5,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Discounts table
CREATE TABLE IF NOT EXISTS discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products,
  discount_percent integer NOT NULL,
  active boolean DEFAULT true,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can view their own activities"
  ON user_activities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities"
  ON user_activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active discounts"
  ON discounts FOR SELECT
  TO public
  USING (active = true AND (end_date IS NULL OR end_date > now()));