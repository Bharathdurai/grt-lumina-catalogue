-- Harden contact form INSERT policy (avoid always-true check)
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(name)) BETWEEN 1 AND 120
  AND length(trim(email)) BETWEEN 5 AND 254
  AND position('@' IN email) > 1
  AND length(trim(message)) BETWEEN 1 AND 2000
  AND (phone IS NULL OR length(trim(phone)) <= 20)
);