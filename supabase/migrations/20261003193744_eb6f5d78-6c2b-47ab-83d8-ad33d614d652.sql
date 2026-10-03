drop policy "class_sessions public read" on public.class_sessions;
create policy "class_sessions public read active" on public.class_sessions for select to anon, authenticated using (is_active = true or public.has_role(auth.uid(),'admin'));
drop policy "cohorts public read" on public.cohorts;
create policy "cohorts public read active" on public.cohorts for select to anon, authenticated using (is_active = true or public.has_role(auth.uid(),'admin'));
drop policy "events public read" on public.events;
create policy "events public read active" on public.events for select to anon, authenticated using (is_active = true or public.has_role(auth.uid(),'admin'));

drop policy "Anyone can read maths forum files" on storage.objects;
create policy "Read attached maths forum files" on storage.objects for select to anon, authenticated
using (bucket_id = 'maths-forum-files' and (
  exists (select 1 from public.maths_forum_attachments a where a.storage_path = storage.objects.name)
  or (storage.foldername(name))[1] = auth.uid()::text
  or public.has_role(auth.uid(),'admin')));

drop policy "Anyone can read profile avatars" on storage.objects;
create policy "Read avatars in use" on storage.objects for select to anon, authenticated
using (bucket_id = 'profile-avatars' and (
  exists (select 1 from public.profiles p where p.avatar_url = storage.objects.name)
  or (storage.foldername(name))[1] = auth.uid()::text
  or public.has_role(auth.uid(),'admin')));