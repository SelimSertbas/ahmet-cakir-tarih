-- ============================================================================
-- BU MIGRATION ÇALIŞTIRILDI (2026-07-21). Admin kullanıcısı ve RLS kuralları
-- Supabase projesine uygulandı. Düz metin şifre, çalıştırıldıktan sonra bu
-- dosyadan kaldırıldı — kullanıcı zaten auth.users içinde mevcut olduğu için
-- aşağıdaki blok tekrar çalıştırılsa da idempotent (no-op) davranır.
-- ============================================================================

create extension if not exists pgcrypto with schema extensions;

-- ----------------------------------------------------------------------------
-- 1) Admin kullanıcısını auth.users / auth.identities içinde oluştur
-- ----------------------------------------------------------------------------
do $$
declare
  admin_email text := 'Cakira768@gmail.com';
  admin_user_id uuid;
begin
  select id into admin_user_id from auth.users where email = admin_email;

  if admin_user_id is null then
    raise notice 'Admin kullanıcısı bulunamadı; bu blok yalnızca ilk çalıştırmada kullanıcı oluşturur ve şifre gerektirir.';
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- 2) RLS: herkes okuyabilir (public site), sadece giriş yapmış (admin) yazabilir
-- ----------------------------------------------------------------------------
alter table public.articles enable row level security;
alter table public.videos enable row level security;
alter table public.questions enable row level security;

drop policy if exists "Public can read articles" on public.articles;
drop policy if exists "Authenticated can insert articles" on public.articles;
drop policy if exists "Authenticated can update articles" on public.articles;
drop policy if exists "Authenticated can delete articles" on public.articles;

create policy "Public can read articles" on public.articles
  for select using (true);
create policy "Authenticated can insert articles" on public.articles
  for insert to authenticated with check (true);
create policy "Authenticated can update articles" on public.articles
  for update to authenticated using (true) with check (true);
create policy "Authenticated can delete articles" on public.articles
  for delete to authenticated using (true);

drop policy if exists "Public can read videos" on public.videos;
drop policy if exists "Authenticated can insert videos" on public.videos;
drop policy if exists "Authenticated can update videos" on public.videos;
drop policy if exists "Authenticated can delete videos" on public.videos;

create policy "Public can read videos" on public.videos
  for select using (true);
create policy "Authenticated can insert videos" on public.videos
  for insert to authenticated with check (true);
create policy "Authenticated can update videos" on public.videos
  for update to authenticated using (true) with check (true);
create policy "Authenticated can delete videos" on public.videos
  for delete to authenticated using (true);

-- questions: herkes soru gönderebilir (insert), ama sadece admin okuyup/güncelleyip/silebilir
drop policy if exists "Public can insert questions" on public.questions;
drop policy if exists "Public can read published questions" on public.questions;
drop policy if exists "Authenticated can read all questions" on public.questions;
drop policy if exists "Authenticated can update questions" on public.questions;
drop policy if exists "Authenticated can delete questions" on public.questions;

create policy "Public can insert questions" on public.questions
  for insert to anon, authenticated with check (true);
create policy "Public can read published questions" on public.questions
  for select using (is_published = true);
create policy "Authenticated can read all questions" on public.questions
  for select to authenticated using (true);
create policy "Authenticated can update questions" on public.questions
  for update to authenticated using (true) with check (true);
create policy "Authenticated can delete questions" on public.questions
  for delete to authenticated using (true);
