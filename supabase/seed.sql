-- Para criar o admin inicial:
-- 1. Registe-se na app com o email r.l.aviz.n8@gmail.com
-- 2. Execute este SQL no Supabase SQL Editor:

UPDATE public.profiles
SET role = 'admin', approved = true
WHERE email = 'r.l.aviz.n8@gmail.com';
