-- Query to check for duplicate classifications
SELECT classification_name, COUNT(*) as count
FROM public.classification
GROUP BY classification_name
HAVING COUNT(*) > 1;

-- Query to see all classifications
SELECT * FROM public.classification
ORDER BY classification_name;
