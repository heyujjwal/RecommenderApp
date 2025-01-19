-- Insert sample products
INSERT INTO products (name, description, price, image_url, category) VALUES
  ('Premium Wireless Headphones', 'High-quality noise-canceling headphones with 30-hour battery life', 299.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'Electronics'),
  ('Smart Fitness Watch', 'Track your health and fitness with this advanced smartwatch', 199.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 'Wearables'),
  ('Organic Coffee Beans', 'Premium single-origin coffee beans from Ethiopia', 24.99, 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800', 'Food & Beverage'),
  ('Yoga Mat', 'Eco-friendly non-slip yoga mat with carrying strap', 49.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', 'Sports'),
  ('Minimalist Backpack', 'Water-resistant laptop backpack with anti-theft features', 89.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 'Accessories'),
  ('Smart LED Bulbs', 'WiFi-enabled color changing smart bulbs', 39.99, 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800', 'Smart Home'),
  ('Ergonomic Office Chair', 'Adjustable office chair with lumbar support and breathable mesh', 149.99, 'https://images.unsplash.com/photo-1585079543568-4d10d3f08b29?w=800', 'Furniture'),
  ('4K Ultra HD Monitor', '27-inch monitor with stunning 4K resolution and vibrant colors', 399.99, 'https://images.unsplash.com/photo-1587825141328-98a7131603c5?w=800', 'Electronics'),
  ('Wireless Gaming Mouse', 'High-performance gaming mouse with customizable DPI settings', 59.99, 'https://images.unsplash.com/photo-1563224572-70fc13eaba1f?w=800', 'Gaming'),
  ('Noise-Cancelling Earbuds', 'Compact true wireless earbuds with active noise cancellation', 129.99, 'https://images.unsplash.com/photo-1585062534140-92c72b96b7ab?w=800', 'Electronics'),
  ('Smart Thermostat', 'WiFi-enabled thermostat with energy-saving features', 249.99, 'https://images.unsplash.com/photo-1594300671265-f6ed4c478b91?w=800', 'Smart Home'),
  ('Electric Scooter', 'Foldable electric scooter with a range of 20 miles', 349.99, 'https://images.unsplash.com/photo-1576018582320-53bcd22d4438?w=800', 'Outdoor'),
  ('Stainless Steel Water Bottle', 'Insulated water bottle keeps drinks hot or cold for hours', 29.99, 'https://images.unsplash.com/photo-1599925277360-86df53f69c32?w=800', 'Accessories'),
  ('Wireless Charging Pad', 'Fast-charging pad compatible with Qi-enabled devices', 34.99, 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800', 'Electronics'),
  ('Deluxe Art Supplies Kit', 'Comprehensive set of art supplies for beginners and professionals', 79.99, 'https://images.unsplash.com/photo-1606312611149-4bd8c5b0f8b4?w=800', 'Hobbies'),
  ('Portable Bluetooth Speaker', 'Compact speaker with rich sound and waterproof design', 69.99, 'https://images.unsplash.com/photo-1586953208553-557a865d1a88?w=800', 'Audio'),
  ('Adjustable Dumbbell Set', 'Space-saving dumbbell set with adjustable weight levels', 199.99, 'https://images.unsplash.com/photo-1562072545-432851d269e2?w=800', 'Sports'),
  ('Graphic Design Tablet', 'Professional drawing tablet with pressure sensitivity', 299.99, 'https://images.unsplash.com/photo-1554284126-5e4e0c0d28d6?w=800', 'Electronics'),
  ('Luxury Scented Candles', 'Hand-poured soy wax candles with calming scents', 39.99, 'https://images.unsplash.com/photo-1599558996282-c3c5bf15cc12?w=800', 'Home Decor'),
  ('Pet Camera with Treat Dispenser', 'Monitor and interact with your pet remotely', 249.99, 'https://images.unsplash.com/photo-1600456892859-f43a9302c4c2?w=800', 'Pet Supplies'),
  ('Premium Wireless Keyboard', 'Ergonomic wireless keyboard with backlit keys', 99.99, 'https://images.unsplash.com/photo-1599941107864-9e279064f1de?w=800', 'Accessories');


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