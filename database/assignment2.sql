-- TASK ONE - Write SQL Statements
-- 1. Insert a new record to the account table
SELECT * FROM public.account;

INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES 
    ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

SELECT * FROM public.account;

-- 2. Modify the Tony Stard account_type to 'Admin'
UPDATE public.account 
SET 
    account_type = 'Admin' 
WHERE 
    account_id = 1;

SELECT * FROM public.account;

-- 3. Delete the Tony Stark record from the account table
DELETE FROM public.account WHERE account_id = 1;

SELECT * FROM public.account;

-- 4. Modify the "GM Hummer" record
SELECT * FROM public.inventory WHERE inv_make = 'GM' AND inv_model = 'Hummer'; -- inv_id = 10

UPDATE 
    public.inventory 
SET 
    inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior') 
WHERE 
    inv_id = 10;

SELECT * FROM public.inventory WHERE inv_id = 10;

-- 5. Inner join the "Sport" category with the "inventory" table
SELECT * FROM public.classification WHERE classification_id = 2; -- classification_name = 'Sport'

SELECT (inv_make, inv_model, classification_name) 
FROM 
    public.inventory
INNER JOIN public.classification
    ON public.inventory.classification_id = public.classification.classification_id
    WHERE public.inventory.classification_id = 2; -- ["Chevy","Camaro","Sport"] and ["Lamborghini","Adventador","Sport"]

-- 6. Update file path for all records in the inventory table
SELECT (inv_image, inv_thumbnail) FROM public.inventory;

UPDATE 
    public.inventory
SET
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

SELECT (inv_image, inv_thumbnail) FROM public.inventory;

-- 7. Save queries 4 and 6 from assignment2.sql to the file db-sql-code.sql

-- TASK TWO - Destroy and Rebuild the Database
