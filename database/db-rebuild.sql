-- Database Rebuild File for CSE 340
-- This file creates the database structure and populates initial data
-- =====================================================

-- Drop existing objects if they exist (for rebuild purposes)
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS classification CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TYPE IF EXISTS account_type CASCADE;

-- Create the account_type ENUM
CREATE TYPE account_type AS ENUM ('Client', 'Employee', 'Admin');

-- Create account table
CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  account_firstname VARCHAR(20) NOT NULL,
  account_lastname VARCHAR(30) NOT NULL,
  account_email VARCHAR(60) NOT NULL UNIQUE,
  account_password VARCHAR(60) NOT NULL,
  account_type account_type DEFAULT 'Client',
  CONSTRAINT valid_email CHECK (account_email LIKE '%@%.%')
);

-- Create classification table
CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(30) NOT NULL UNIQUE
);

-- Create inventory table
CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  inv_make VARCHAR(30) NOT NULL,
  inv_model VARCHAR(40) NOT NULL,
  inv_year SMALLINT NOT NULL,
  inv_description TEXT NOT NULL,
  inv_image VARCHAR(255) NOT NULL,
  inv_thumbnail VARCHAR(255) NOT NULL,
  classification_id INTEGER NOT NULL REFERENCES classification(classification_id),
  inv_price NUMERIC(10, 2)
);

-- Insert classification data
INSERT INTO classification (classification_name)
VALUES 
  ('SUV'),
  ('Sedan'),
  ('Sport'),
  ('Truck'),
  ('Custom');

-- Insert inventory data
INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, classification_id, inv_price)
VALUES 
  ('Chevy', 'Silverado', 2011, 'The Silverado 1500 is a full-size pickup truck. Work or play, it is a perfect fit for a.<br><br>Lorem ipsum dolor sit amet.', '/images/delorean.jpg', '/images/delorean-tn.jpg', 4, 13995.00),
  ('GMC', 'Hummer', 2010, 'HUMMER H2 Sport Utility Vehicle. Red HUMMER H2 9700 lbs. GVR...<br><br>LOTS of fun not just work. everybody will see you coming and going.', '/images/hummeroma.jpg', '/images/hummer-tn.jpg', 2, 34995.00),
  ('Jeep', 'Wrangler', 2012, 'The Jeep Wrangler is a compact and fundamental model...', '/images/jeep.jpg', '/images/jeep-tn.jpg', 1, 28045.00),
  ('Lamborghini', 'Adventador', 2012, 'This V-12 twin turbocharged engine makes 740 hp...', '/images/lambo.jpg', '/images/lambo-tn.jpg', 3, 417650.00),
  ('Cadillac', 'Escalade', 2015, 'Style, power, and luxury define the Cadillac Escalade...', '/images/escalade.jpg', '/images/escalade-tn.jpg', 1, 54345.00);

-- Query 4 from Assignment 2: Update GM Hummer description using PostgreSQL REPLACE function
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Query 6 from Assignment 2: Update all inventory image paths to add '/vehicles' in the middle
UPDATE inventory
SET 
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
WHERE inv_image LIKE '/images/%' AND inv_thumbnail LIKE '/images/%';
