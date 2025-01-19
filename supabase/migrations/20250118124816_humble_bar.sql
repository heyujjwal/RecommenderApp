-- Insert sample products
INSERT INTO products (name, description, price, image_url, category) VALUES
  ('Premium Wireless Headphones', 'High-quality noise-canceling headphones with 30-hour battery life', 299.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'Electronics'),
  ('Smart Fitness Watch', 'Track your health and fitness with this advanced smartwatch', 199.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 'Wearables'),
  ('Organic Coffee Beans', 'Premium single-origin coffee beans from Ethiopia', 24.99, 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800', 'Food & Beverage'),
  ('Yoga Mat', 'Eco-friendly non-slip yoga mat with carrying strap', 49.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', 'Sports'),
  ('Minimalist Backpack', 'Water-resistant laptop backpack with anti-theft features', 89.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 'Accessories'),
  ('Smart LED Bulbs', 'WiFi-enabled color changing smart bulbs', 39.99, 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800', 'Smart Home');

-- Insert sample discounts
INSERT INTO discounts (product_id, discount_percent, active, end_date) 
SELECT 
  id,
  CASE 
    WHEN name LIKE '%Headphones%' THEN 20
    WHEN name LIKE '%Watch%' THEN 15
    WHEN name LIKE '%Coffee%' THEN 10
    ELSE 25
  END,
  true,
  now() + interval '30 days'
FROM products;

-- Note: For user_activities and recommendations, you'll need to:
-- 1. Create a user through authentication
-- 2. Get the user's UUID
-- 3. Replace 'YOUR_USER_ID' with the actual UUID

-- Example (after you have a user ID):
-- Insert sample user activities
INSERT INTO user_activities (user_id, product_id, activity_type)
SELECT 
  auth.uid(),
  id,
  'view'
FROM products
WHERE category IN ('Electronics', 'Wearables');

-- Insert sample recommendations
INSERT INTO recommendations (user_id, product_id, score)
SELECT 
  auth.uid(),
  id,
  CASE 
    WHEN category = 'Electronics' THEN 0.95
    WHEN category = 'Wearables' THEN 0.85
    ELSE 0.75
  END
FROM products
WHERE category IN ('Electronics', 'Wearables', 'Smart Home');