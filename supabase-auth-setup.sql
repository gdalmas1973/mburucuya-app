-- =============================================
-- MBURUCUYÁ APP — Setup de autenticación
-- Ejecutar en Supabase → SQL Editor
-- =============================================

-- 1. Función que crea el perfil automáticamente cuando alguien se registra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfiles (id, email, nombre, rol)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    'visitante'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 2. Trigger que dispara la función al registrarse
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Políticas para que cada usuario lea/edite su propio perfil
create policy "Perfil: leer propio"
  on perfiles for select to authenticated
  using (auth.uid() = id);

create policy "Perfil: insertar propio"
  on perfiles for insert to authenticated
  with check (auth.uid() = id);

create policy "Perfil: actualizar propio"
  on perfiles for update to authenticated
  using (auth.uid() = id);

-- 4. Usuarios autenticados pueden solicitar reservas
create policy "Reservas: insertar autenticado"
  on reservas for insert to authenticated
  with check (true);

-- 5. Administradores pueden aprobar/rechazar reservas
create policy "Reservas: admin puede actualizar"
  on reservas for update to authenticated
  using ((select rol from perfiles where id = auth.uid()) = 'administrador');

-- 6. Administradores pueden publicar comunicados
create policy "Comunicados: admin puede insertar"
  on comunicados for insert to authenticated
  with check ((select rol from perfiles where id = auth.uid()) = 'administrador');

create policy "Comunicados: admin puede actualizar"
  on comunicados for update to authenticated
  using ((select rol from perfiles where id = auth.uid()) = 'administrador');

-- 7. Administradores pueden cargar gastos
create policy "Gastos: admin puede insertar"
  on gastos for insert to authenticated
  with check ((select rol from perfiles where id = auth.uid()) = 'administrador');

create policy "Gastos: admin puede actualizar"
  on gastos for update to authenticated
  using ((select rol from perfiles where id = auth.uid()) = 'administrador');

-- =============================================
-- DESPUÉS DE REGISTRARTE EN LA APP, ejecutá:
-- (reemplazá con tu email real)
-- =============================================
-- UPDATE perfiles SET rol = 'administrador', apartamento_id = (SELECT id FROM apartamentos WHERE numero = '4B') WHERE email = 'tu-email@aqui.com';
