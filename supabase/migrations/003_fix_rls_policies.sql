-- Corrigir recursao infinita nas RLS policies
-- Executar este script no SQL Editor do Supabase

-- 1. Criar funcao SECURITY DEFINER para verificar role sem triggerar RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_approved()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND approved = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. Remover policies antigas da tabela profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_admin" ON public.profiles;

-- 3. Recriar policies de profiles usando as funcoes SECURITY DEFINER
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "profiles_delete_admin" ON public.profiles
  FOR DELETE USING (public.is_admin());

-- 4. Remover policies antigas da tabela events
DROP POLICY IF EXISTS "events_select_approved" ON public.events;
DROP POLICY IF EXISTS "events_insert_admin" ON public.events;
DROP POLICY IF EXISTS "events_update_admin" ON public.events;
DROP POLICY IF EXISTS "events_delete_admin" ON public.events;

-- 5. Recriar policies de events usando as funcoes SECURITY DEFINER
CREATE POLICY "events_select_approved" ON public.events
  FOR SELECT USING (public.is_approved());

CREATE POLICY "events_insert_admin" ON public.events
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "events_update_admin" ON public.events
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "events_delete_admin" ON public.events
  FOR DELETE USING (public.is_admin());

-- 6. Remover policies antigas da tabela notification_log
DROP POLICY IF EXISTS "notification_log_select_admin" ON public.notification_log;
DROP POLICY IF EXISTS "notification_log_insert_service" ON public.notification_log;

-- 7. Recriar policies de notification_log
CREATE POLICY "notification_log_select_admin" ON public.notification_log
  FOR SELECT USING (public.is_admin());

CREATE POLICY "notification_log_insert_service" ON public.notification_log
  FOR INSERT WITH CHECK (true);
