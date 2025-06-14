-- Seed data for Exquisite Bakery Inventory System

-- Insert ingredients
INSERT INTO ingredients (name, unit, cost_per_unit, current_stock, min_stock) VALUES
('All-purpose flour', 'kg', 15.50, 25.0, 10.0),
('Cake flour', 'kg', 18.75, 15.0, 5.0),
('Granulated sugar', 'kg', 22.00, 20.0, 8.0),
('Brown sugar', 'kg', 25.50, 10.0, 5.0),
('Butter', 'kg', 120.00, 12.0, 5.0),
('Eggs', 'unit', 2.50, 60.0, 24.0),
('Milk', 'l', 25.00, 15.0, 5.0),
('Cocoa powder', 'kg', 85.00, 5.0, 2.0),
('Baking powder', 'kg', 65.00, 2.0, 0.5),
('Vanilla extract', 'ml', 0.50, 500.0, 200.0),
('Salt', 'kg', 12.00, 3.0, 1.0),
('Cream cheese', 'kg', 95.00, 8.0, 3.0),
('Powdered sugar', 'kg', 28.00, 10.0, 4.0),
('Vegetable oil', 'l', 35.00, 10.0, 3.0),
('Chocolate chips', 'kg', 110.00, 7.0, 3.0),
('Strawberries', 'kg', 65.00, 5.0, 2.0),
('Blueberries', 'kg', 120.00, 3.0, 1.0),
('Lemon', 'unit', 5.00, 20.0, 10.0),
('Cream', 'l', 45.00, 8.0, 3.0),
('Yeast', 'kg', 150.00, 1.0, 0.5);

-- Insert recipes
INSERT INTO recipes (name, description, instructions, selling_price) VALUES
('Chocolate Cake', 'Rich chocolate cake with buttercream frosting', 
'1. Preheat oven to 180°C.
2. Mix dry ingredients in a bowl.
3. Add wet ingredients and mix until smooth.
4. Pour into greased cake pans.
5. Bake for 30-35 minutes.
6. Cool and frost with buttercream.', 
250.00),

('Vanilla Cupcakes', 'Light and fluffy vanilla cupcakes with cream cheese frosting', 
'1. Preheat oven to 175°C.
2. Cream butter and sugar.
3. Add eggs one at a time.
4. Mix in dry ingredients alternating with milk.
5. Fill cupcake liners 2/3 full.
6. Bake for 18-20 minutes.
7. Cool and top with cream cheese frosting.', 
25.00),

('Strawberry Cheesecake', 'Creamy cheesecake with fresh strawberry topping', 
'1. Prepare graham cracker crust.
2. Beat cream cheese, sugar, and vanilla.
3. Add eggs one at a time.
4. Pour into crust.
5. Bake at 160°C for 55-60 minutes.
6. Cool and refrigerate for 4 hours.
7. Top with fresh strawberries.', 
300.00),

('Artisan Bread', 'Rustic artisan bread with a crispy crust', 
'1. Mix flour, water, salt, and yeast.
2. Let rise for 12-18 hours.
3. Shape into a loaf.
4. Preheat Dutch oven at 230°C.
5. Bake covered for 30 minutes.
6. Remove lid and bake for 15 more minutes.', 
45.00),

('Blueberry Muffins', 'Moist muffins loaded with fresh blueberries', 
'1. Preheat oven to 190°C.
2. Mix dry ingredients.
3. In another bowl, mix wet ingredients.
4. Combine wet and dry ingredients.
5. Fold in blueberries.
6. Fill muffin cups.
7. Bake for 20-25 minutes.', 
18.00);

-- Insert recipe ingredients
-- Chocolate Cake
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT 
  (SELECT id FROM recipes WHERE name = 'Chocolate Cake'),
  (SELECT id FROM ingredients WHERE name = 'All-purpose flour'),
  2.0;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT 
  (SELECT id FROM recipes WHERE name = 'Chocolate Cake'),
  (SELECT id FROM ingredients WHERE name = 'Granulated sugar'),
  2.0;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT 
  (SELECT id FROM recipes WHERE name = 'Chocolate Cake'),
  (SELECT id FROM ingredients WHERE name = 'Cocoa powder'),
  0.75;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT 
  (SELECT id FROM recipes WHERE name = 'Chocolate Cake'),
  (SELECT id FROM ingredients WHERE name = 'Baking powder'),
  0.02;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT 
  (SELECT id FROM recipes WHERE name = 'Chocolate Cake'),
  (SELECT id FROM ingredients WHERE name = 'Eggs'),
  4.0;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT 
  (SELECT id FROM recipes WHERE name = 'Chocolate Cake'),
  (SELECT id FROM ingredients WHERE name = 'Milk'),
  1.0;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT 
  (SELECT id FROM recipes WHERE name = 'Chocolate Cake'),
  (SELECT id FROM ingredients WHERE name = 'Vegetable oil'),
  0.5;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT 
  (SELECT id FROM recipes WHERE name = 'Chocolate Cake'),
  (SELECT id FROM ingredients WHERE name = 'Vanilla extract'),
  10.0;

-- Vanilla Cupcakes
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT 
  (SELECT id FROM recipes WHERE name = 'Vanilla Cupcakes'),
  (SELECT id FROM ingredients WHERE name = 'Cake flour'),
  0.25;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT 
  (SELECT id FROM recipes WHERE name = 'Vanilla Cupcakes'),
  (SELECT id FROM ingredients WHERE name = 'Granulated sugar'),
  0.15;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT 
  (SELECT id FROM recipes WHERE name = 'Vanilla Cupcakes'),
  (SELECT id FROM ingredients WHERE name = 'Butter'),
  0.1;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT 
  (SELECT id FROM recipes WHERE name = 'Vanilla Cupcakes'),
  (SELECT id FROM ingredients WHERE name = 'Eggs'),
  2.0;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT 
  (SELECT id FROM recipes WHERE name = 'Vanilla Cupcakes'),
  (SELECT id FROM ingredients WHERE name = 'Milk'),
  0.1;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT 
  (SELECT id FROM recipes WHERE name = 'Vanilla Cupcakes'),
  (SELECT id FROM ingredients WHERE name = 'Vanilla extract'),
  5.0;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT 
  (SELECT id FROM recipes WHERE name = 'Vanilla Cupcakes'),
  (SELECT id FROM ingredients WHERE name = 'Baking powder'),
  0.01;

-- Create a production plan
INSERT INTO production_plans (name, date, status, notes) VALUES
('Weekend Special', CURRENT_DATE + INTERVAL '2 days', 'scheduled', 'Prepare for weekend rush'),
('Corporate Order - ABC Company', CURRENT_DATE + INTERVAL '5 days', 'scheduled', 'Delivery by 10 AM'),
('Weekly Bread Production', CURRENT_DATE + INTERVAL '1 day', 'draft', 'Standard weekly bread production');

-- Add items to production plans
INSERT INTO production_items (production_plan_id, recipe_id, quantity)
SELECT 
  (SELECT id FROM production_plans WHERE name = 'Weekend Special'),
  (SELECT id FROM recipes WHERE name = 'Chocolate Cake'),
  5;

INSERT INTO production_items (production_plan_id, recipe_id, quantity)
SELECT 
  (SELECT id FROM production_plans WHERE name = 'Weekend Special'),
  (SELECT id FROM recipes WHERE name = 'Vanilla Cupcakes'),
  24;

INSERT INTO production_items (production_plan_id, recipe_id, quantity)
SELECT 
  (SELECT id FROM production_plans WHERE name = 'Weekend Special'),
  (SELECT id FROM recipes WHERE name = 'Strawberry Cheesecake'),
  3;

INSERT INTO production_items (production_plan_id, recipe_id, quantity)
SELECT 
  (SELECT id FROM production_plans WHERE name = 'Corporate Order - ABC Company'),
  (SELECT id FROM recipes WHERE name = 'Vanilla Cupcakes'),
  48;

INSERT INTO production_items (production_plan_id, recipe_id, quantity)
SELECT 
  (SELECT id FROM production_plans WHERE name = 'Weekly Bread Production'),
  (SELECT id FROM recipes WHERE name = 'Artisan Bread'),
  20;
