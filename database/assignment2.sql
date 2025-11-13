-- Assignment 2 - Task 1: SQL CRUD Queries
-- =====================================================

-- Query 1: Insert new Tony Stark record
-- account_id and account_type are handled by the database (serial and default)
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Query 2: Update Tony Stark's account_type to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Query 3: Delete Tony Stark record
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- Query 4: Update GM Hummer description using PostgreSQL REPLACE function
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Query 5: Inner join to select Sport category vehicles
SELECT inv_make, inv_model, classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

-- Query 6: Update all inventory image paths to add '/vehicles' in the middle
UPDATE inventory
SET 
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
WHERE inv_image LIKE '/images/%' AND inv_thumbnail LIKE '/images/%';
