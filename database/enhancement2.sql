INSERT INTO public.client
    (client_id, client_firstname, client_lastname, client_email client_password)
VALUES
    ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE public.client
SET client_type = 'Admin'
WHERE client_id = 1;

DELETE 
FROM public.client
WHERE Client_ID = 1;

UPDATE
    public.inventory
SET 
    inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE 
    inv_id = 10

SELECT inv_make, inv_model, classification_name
FROM public.inventory
INNER JOIN public.classification
ON inventory.inv_model = classification.classification_name

UPDATE
    public.inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');



