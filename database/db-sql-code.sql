-- Drop existing tables and type to avoid conflicts
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS classification;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS account_type;

-- Create a lookup table for account types instead of ENUM
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'account_type')
BEGIN
    CREATE TABLE account_type (
        account_type_id INT IDENTITY(1,1) PRIMARY KEY,
        account_type_name VARCHAR(255) NOT NULL UNIQUE
    );
END

-- Insert possible account types
INSERT INTO account_type (account_type_name) VALUES
    ('Client'),
    ('Employee'),
    ('Admin');

-- Table structure for table 'classification'
IF OBJECT_ID('classification', 'U') IS NULL
BEGIN
    CREATE TABLE classification (
        classification_id INT IDENTITY(1,1) PRIMARY KEY,
        classification_name VARCHAR(255) NOT NULL
    );
END

-- Table structure for 'inventory'
IF OBJECT_ID('inventory', 'U') IS NULL
BEGIN
    CREATE TABLE inventory
    (
        inv_id INT IDENTITY(1,1) PRIMARY KEY,
        inv_make VARCHAR(255) NOT NULL,
        inv_model VARCHAR(255) NOT NULL,
        inv_year CHAR(4) NOT NULL,
        inv_description TEXT NOT NULL,
        inv_image VARCHAR(255) NOT NULL,
        inv_thumbnail VARCHAR(255) NOT NULL,
        inv_price NUMERIC(9, 0) NOT NULL,
        inv_miles INT NOT NULL,
        inv_color VARCHAR(255) NOT NULL,
        classification_id INT NOT NULL
    );
END
-- Create relationship between 'classification' and 'inventory' tables
ALTER TABLE inventory
ADD CONSTRAINT fk_classification
    FOREIGN KEY (classification_id)
    REFERENCES classification(classification_id)
    ON UPDATE CASCADE
    ON DELETE NO ACTION;

-- Table structure for 'account'
IF OBJECT_ID('account', 'U') IS NULL
BEGIN
    CREATE TABLE account (
        account_id INT IDENTITY(1,1) PRIMARY KEY,
        account_firstname VARCHAR(255) NOT NULL,
        account_lastname VARCHAR(255) NOT NULL,
        account_email VARCHAR(255) NOT NULL,
        account_password VARCHAR(255) NOT NULL,
        account_type_id INT NOT NULL DEFAULT 1,
        CONSTRAINT fk_account_type FOREIGN KEY (account_type_id)
            REFERENCES account_type(account_type_id)
            ON UPDATE CASCADE
            ON DELETE NO ACTION
    );
END

-- Data for table 'classification'
INSERT INTO classification (classification_name)
VALUES ('Custom'),
    ('Sport'),
    ('SUV'),
    ('Truck'),
    ('Sedan');

-- Data for table `inventory`
INSERT INTO inventory (
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
VALUES   (
    'Chevy',
    'Camaro',
    '2018',
    'If you want to look cool this is the ar you need! This car has great performance at an affordable price. Own it today!',
    '/images/vehicles/camaro.jpg',
    '/images/vehicles/camaro-tn.jpg',
    25000,
    101222,
    'Silver',
    2
  ), (
    'Batmobile',
    'Custom',
    '2007',
    'Ever want to be a super hero? now you can with the batmobile. This car allows you to switch to bike mode allowing you to easily maneuver through traffic during rush hour.',
    '/images/vehicles/batmobile.jpg',
    '/images/vehicles/batmobile-tn.jpg',
    65000,
    29887,
    'Black',
    1
  ), (
    'FBI',
    'Surveillance Van',
    '2016',
    'Do you like police shows? You will feel right at home driving this van, comes complete with survalence equipments for and extra fee of $2,000 a month.',
    '/images/vehicles/survan.jpg',
    '/images/vehicles/survan-tn.jpg',
    20000,
    19851,
    'Brown',
    1
  ), (
    'Dog ',
    'Car',
    '1997',
    'Do you like dogs? Well this car is for you straight from the 90s from Aspen, Colorado we have the orginal Dog Car complete with fluffy ears.',
    '/images/vehicles/dog-car.jpg',
    '/images/vehicles/dog-car-tn.jpg',
    35000,
    71632,
    'White',
    1
  ), (
    'Jeep',
    'Wrangler',
    '2019',
    'The Jeep Wrangler is small and compact with enough power to get you where you want to go. Its great for everyday driving as well as offroading weather that be on the the rocks or in the mud!',
    '/images/vehicles/wrangler.jpg',
    '/images/vehicles/wrangler-tn.jpg',
    28045,
    41205,
    'Yellow',
    3
  ), (
    'Lamborghini',
    'Adventador',
    '2016',
    'This V-12 engine packs a punch in this sporty car. Make sure you wear your seatbelt and obey all traffic laws. ',
    '/images/vehicles/adventador.jpg',
    '/images/vehicles/adventador-tn.jpg',
    417650,
    71003,
    'Blue',
    2
  ), (
    'Aerocar International',
    'Aerocar',
    '1963',
    'Are you sick of rushhour trafic? This car converts into an airplane to get you where you are going fast. Only 6 of these were made, get them while they last!',
    '/images/vehicles/aerocar.jpg',
    '/images/vehicles/aerocar-tn.jpg',
    700000,
    18956,
    'Red',
    1
  ), (
    'Monster',
    'Truck',
    '1995',
    'Most trucks are for working, this one is for fun. This beast comes with 60 inch tires giving you traction needed to jump and roll in the mud.',
    '/images/vehicles/monster-truck.jpg',
    '/images/vehicles/monster-truck-tn.jpg',
    150000,
    3998,
    'purple',
    1
  ), (
    'Cadillac',
    'Escalade',
    '2019',
    'This stylin car is great for any occasion from going to the beach to meeting the president. The luxurious inside makes this car a home away from home.',
    '/images/vehicles/escalade.jpg',
    '/images/vehicles/escalade-tn.jpg',
    75195,
    41958,
    'Black',
    4
  ), (
    'GM',
    'Hummer',
    '2016',
    'Do you have 6 kids and like to go offroading? The Hummer gives you a huge interior with an engine to get you out of any muddy or rocky situation.',
    '/images/vehicles/hummer.jpg',
    '/images/vehicles/hummer-tn.jpg',
    58800,
    56564,
    'Yellow',
    4
  ), (
    'Mechanic',
    'Special',
    '1964',
    'Not sure where this car came from. however with a little tlc it will run as good a new.',
    '/images/vehicles/mechanic.jpg',
    '/images/vehicles/mechanic-tn.jpg',
    100,
    200125,
    'Rust',
    5
  ), (
    'Ford',
    'Model T',
    '1921',
    'The Ford Model T can be a bit tricky to drive. It was the first car to be put into production. You can get it in any color you want as long as it is black.',
    '/images/vehicles/model-t.jpg',
    '/images/vehicles/model-t-tn.jpg',
    30000,
    26357,
    'Black',
    5
  ), (
    'Mystery',
    'Machine',
    '1999',
    'Scooby and the gang always found luck in solving their mysteries because of there 4 wheel drive Mystery Machine. This Van will help you do whatever job you are required to with a success rate of 100%.',
    '/images/vehicles/mystery-van.jpg',
    '/images/vehicles/mystery-van-tn.jpg',
    10000,
    128564,
    'Green',
    1
  ),
  (
    'Spartan',
    'Fire Truck',
    '2012',
    'Emergencies happen often. Be prepared with this Spartan fire truck. Comes complete with 1000 ft. of hose and a 1000 gallon tank.',
    '/images/vehicles/fire-truck.jpg',
    '/images/vehicles/fire-truck-tn.jpg',
    50000,
    38522,
    'Red',
    4
  ), (
    'Ford',
    'Crown Victoria',
    '2013',
    'After the police force updated their fleet these cars are now available to the public! These cars come equiped with the siren which is convenient for college students running late to class.',
    '/images/vehicles/crwn-vic.jpg',
    '/images/vehicles/crwn-vic-tn.jpg',
    10000,
    108247,
    'White',
    5
  );