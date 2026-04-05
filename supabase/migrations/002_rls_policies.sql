-- Ativar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;

-- ========== PROFILES ==========

-- Users podem ver o proprio perfil
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins podem ver todos os perfis
CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem atualizar perfis (aprovar/rejeitar)
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem eliminar perfis (rejeitar users)
CREATE POLICY "profiles_delete_admin" ON public.profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ========== EVENTS ==========

-- Users aprovados podem ver eventos
CREATE POLICY "events_select_approved" ON public.events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND approved = true
    )
  );

-- Admins podem criar eventos
CREATE POLICY "events_insert_admin" ON public.events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem editar eventos
CREATE POLICY "events_update_admin" ON public.events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem eliminar eventos
CREATE POLICY "events_delete_admin" ON public.events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ========== NOTIFICATION_LOG ==========

-- Admins podem ver logs de notificacao
CREATE POLICY "notification_log_select_admin" ON public.notification_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert permitido via service_role (Edge Function)
CREATE POLICY "notification_log_insert_service" ON public.notification_log
  FOR INSERT WITH CHECK (true);
