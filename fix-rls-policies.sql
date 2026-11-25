-- ============================================================================
-- Yaga Designs — Fix RLS Policies (run this in Supabase SQL Editor)
-- Drops all existing policies and recreates them as fully public
-- so the anon key can read/write without authentication.
-- ============================================================================

-- ─── Tables ──────────────────────────────────────────────────────────────────

-- products
drop policy if exists "Public read products"      on public.products;
drop policy if exists "Public insert products"    on public.products;
drop policy if exists "Public update products"    on public.products;
drop policy if exists "Public delete products"    on public.products;
drop policy if exists "Admin insert products"     on public.products;
drop policy if exists "Admin update products"     on public.products;
drop policy if exists "Admin delete products"     on public.products;

create policy "Public read products"   on public.products for select using (true);
create policy "Public insert products" on public.products for insert with check (true);
create policy "Public update products" on public.products for update using (true);
create policy "Public delete products" on public.products for delete using (true);

-- portfolio
drop policy if exists "Public read portfolio"     on public.portfolio;
drop policy if exists "Public insert portfolio"   on public.portfolio;
drop policy if exists "Public update portfolio"   on public.portfolio;
drop policy if exists "Public delete portfolio"   on public.portfolio;
drop policy if exists "Admin insert portfolio"    on public.portfolio;
drop policy if exists "Admin update portfolio"    on public.portfolio;
drop policy if exists "Admin delete portfolio"    on public.portfolio;

create policy "Public read portfolio"   on public.portfolio for select using (true);
create policy "Public insert portfolio" on public.portfolio for insert with check (true);
create policy "Public update portfolio" on public.portfolio for update using (true);
create policy "Public delete portfolio" on public.portfolio for delete using (true);

-- testimonials
drop policy if exists "Public read testimonials"     on public.testimonials;
drop policy if exists "Public insert testimonials"   on public.testimonials;
drop policy if exists "Public update testimonials"   on public.testimonials;
drop policy if exists "Public delete testimonials"   on public.testimonials;
drop policy if exists "Admin insert testimonials"    on public.testimonials;
drop policy if exists "Admin update testimonials"    on public.testimonials;
drop policy if exists "Admin delete testimonials"    on public.testimonials;

create policy "Public read testimonials"   on public.testimonials for select using (true);
create policy "Public insert testimonials" on public.testimonials for insert with check (true);
create policy "Public update testimonials" on public.testimonials for update using (true);
create policy "Public delete testimonials" on public.testimonials for delete using (true);

-- offers
drop policy if exists "Public read offers"     on public.offers;
drop policy if exists "Public insert offers"   on public.offers;
drop policy if exists "Public update offers"   on public.offers;
drop policy if exists "Public delete offers"   on public.offers;
drop policy if exists "Admin insert offers"    on public.offers;
drop policy if exists "Admin update offers"    on public.offers;
drop policy if exists "Admin delete offers"    on public.offers;

create policy "Public read offers"   on public.offers for select using (true);
create policy "Public insert offers" on public.offers for insert with check (true);
create policy "Public update offers" on public.offers for update using (true);
create policy "Public delete offers" on public.offers for delete using (true);

-- orders
drop policy if exists "Public read orders"    on public.orders;
drop policy if exists "Public create orders"  on public.orders;
drop policy if exists "Public update orders"  on public.orders;
drop policy if exists "Public delete orders"  on public.orders;
drop policy if exists "Admin update orders"   on public.orders;
drop policy if exists "Admin delete orders"   on public.orders;

create policy "Public read orders"   on public.orders for select using (true);
create policy "Public insert orders" on public.orders for insert with check (true);
create policy "Public update orders" on public.orders for update using (true);
create policy "Public delete orders" on public.orders for delete using (true);

-- content
drop policy if exists "Public read content"     on public.content;
drop policy if exists "Public insert content"   on public.content;
drop policy if exists "Public update content"   on public.content;
drop policy if exists "Public delete content"   on public.content;
drop policy if exists "Admin insert content"    on public.content;
drop policy if exists "Admin update content"    on public.content;
drop policy if exists "Admin delete content"    on public.content;

create policy "Public read content"   on public.content for select using (true);
create policy "Public insert content" on public.content for insert with check (true);
create policy "Public update content" on public.content for update using (true);
create policy "Public delete content" on public.content for delete using (true);

-- ─── Storage bucket product-images ────────────────────────────────────────────

drop policy if exists "Public read product-images"             on storage.objects;
drop policy if exists "Public upload product-images"           on storage.objects;
drop policy if exists "Public update product-images"           on storage.objects;
drop policy if exists "Public delete product-images"           on storage.objects;
drop policy if exists "Authenticated upload product-images"    on storage.objects;
drop policy if exists "Authenticated update product-images"    on storage.objects;
drop policy if exists "Authenticated delete product-images"    on storage.objects;

create policy "Public read product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Public upload product-images"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

create policy "Public update product-images"
  on storage.objects for update
  using (bucket_id = 'product-images');

create policy "Public delete product-images"
  on storage.objects for delete
  using (bucket_id = 'product-images');
