-- Fix permissions so public contact form can insert rows
GRANT INSERT ON TABLE public.contact_submissions TO anon, authenticated;