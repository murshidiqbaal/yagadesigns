-- ============================================================================
-- Yaga Designs — Supabase Database & Storage Setup SQL
-- Run this entire script in your Supabase Dashboard → SQL Editor
-- ============================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── 1. Tables ───────────────────────────────────────────────────────────────

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null,
  price text,
  image_url text,
  image_urls text[] default '{}',
  fabric text,
  embroidery text,
  occasion text,
  colors text[] default '{}',
  is_customizable boolean default true,
  variants jsonb default '[]'::jsonb,
  enquiry_count integer default 0 check (enquiry_count >= 0),
  like_count integer default 0 check (like_count >= 0),
  instagram_reel_link text,
  reel_thumbnail text,
  reels jsonb default '[]'::jsonb,
  is_exclusive boolean default false,
  exclusive_badge text,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_created_at on public.products (created_at desc);

-- Portfolio
create table if not exists public.portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  image_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_portfolio_created_at on public.portfolio (created_at desc);

-- Testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  content text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  avatar_url text,
  is_featured boolean default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_testimonials_created_at on public.testimonials (created_at desc);

-- Offers
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  button_text text,
  link text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_offers_active_created on public.offers (is_active, created_at desc);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  customer_name text not null,
  phone_number text not null,
  email text,
  wedding_date text,
  product_id text not null,
  product_name text not null,
  product_image text,
  selected_color text,
  selected_size text,
  quantity integer default 1,
  customization_notes text,
  status text not null default 'New',
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_order_id on public.orders (order_id);
create index if not exists idx_orders_created_at on public.orders (created_at desc);

-- Site Content (Hero, Services, etc.)
create table if not exists public.content (
  id text primary key,
  title text,
  subtitle text,
  button_text text,
  image_url text,
  services_data jsonb,
  updated_at timestamptz not null default now()
);

-- ─── 2. Atomic Analytics RPC Functions ───────────────────────────────────────

create or replace function public.increment_product_enquiry(p_product_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.products
  set enquiry_count = coalesce(enquiry_count, 0) + 1
  where id = p_product_id;
end;
$$;

create or replace function public.toggle_product_like(p_product_id uuid, p_increment boolean)
returns void
language plpgsql
security definer
as $$
begin
  update public.products
  set like_count = case
    when p_increment then coalesce(like_count, 0) + 1
    else greatest(0, coalesce(like_count, 0) - 1)
  end
  where id = p_product_id;
end;
$$;

-- ─── 3. Row Level Security (RLS) ─────────────────────────────────────────────

alter table public.products enable row level security;
alter table public.portfolio enable row level security;
alter table public.testimonials enable row level security;
alter table public.offers enable row level security;
alter table public.orders enable row level security;
alter table public.content enable row level security;

-- Products policies
drop policy if exists "Public read products" on public.products;
drop policy if exists "Admin insert products" on public.products;
drop policy if exists "Admin update products" on public.products;
drop policy if exists "Admin delete products" on public.products;
drop policy if exists "Public insert products" on public.products;
drop policy if exists "Public update products" on public.products;
drop policy if exists "Public delete products" on public.products;
create policy "Public read products" on public.products for select using (true);
create policy "Public insert products" on public.products for insert with check (true);
create policy "Public update products" on public.products for update using (true);
create policy "Public delete products" on public.products for delete using (true);

-- Portfolio policies
drop policy if exists "Public read portfolio" on public.portfolio;
drop policy if exists "Admin insert portfolio" on public.portfolio;
drop policy if exists "Admin update portfolio" on public.portfolio;
drop policy if exists "Admin delete portfolio" on public.portfolio;
drop policy if exists "Public insert portfolio" on public.portfolio;
drop policy if exists "Public update portfolio" on public.portfolio;
drop policy if exists "Public delete portfolio" on public.portfolio;
create policy "Public read portfolio" on public.portfolio for select using (true);
create policy "Public insert portfolio" on public.portfolio for insert with check (true);
create policy "Public update portfolio" on public.portfolio for update using (true);
create policy "Public delete portfolio" on public.portfolio for delete using (true);

-- Testimonials policies
drop policy if exists "Public read testimonials" on public.testimonials;
drop policy if exists "Admin insert testimonials" on public.testimonials;
drop policy if exists "Admin update testimonials" on public.testimonials;
drop policy if exists "Admin delete testimonials" on public.testimonials;
drop policy if exists "Public insert testimonials" on public.testimonials;
drop policy if exists "Public update testimonials" on public.testimonials;
drop policy if exists "Public delete testimonials" on public.testimonials;
create policy "Public read testimonials" on public.testimonials for select using (true);
create policy "Public insert testimonials" on public.testimonials for insert with check (true);
create policy "Public update testimonials" on public.testimonials for update using (true);
create policy "Public delete testimonials" on public.testimonials for delete using (true);

-- Offers policies
drop policy if exists "Public read offers" on public.offers;
drop policy if exists "Admin insert offers" on public.offers;
drop policy if exists "Admin update offers" on public.offers;
drop policy if exists "Admin delete offers" on public.offers;
drop policy if exists "Public insert offers" on public.offers;
drop policy if exists "Public update offers" on public.offers;
drop policy if exists "Public delete offers" on public.offers;
create policy "Public read offers" on public.offers for select using (true);
create policy "Public insert offers" on public.offers for insert with check (true);
create policy "Public update offers" on public.offers for update using (true);
create policy "Public delete offers" on public.offers for delete using (true);

-- Orders policies
drop policy if exists "Public read orders" on public.orders;
drop policy if exists "Public create orders" on public.orders;
drop policy if exists "Admin update orders" on public.orders;
drop policy if exists "Admin delete orders" on public.orders;
drop policy if exists "Public update orders" on public.orders;
drop policy if exists "Public delete orders" on public.orders;
create policy "Public read orders" on public.orders for select using (true);
create policy "Public create orders" on public.orders for insert with check (true);
create policy "Public update orders" on public.orders for update using (true);
create policy "Public delete orders" on public.orders for delete using (true);

-- Content policies
drop policy if exists "Public read content" on public.content;
drop policy if exists "Admin insert content" on public.content;
drop policy if exists "Admin update content" on public.content;
drop policy if exists "Admin delete content" on public.content;
drop policy if exists "Public insert content" on public.content;
drop policy if exists "Public update content" on public.content;
drop policy if exists "Public delete content" on public.content;
create policy "Public read content" on public.content for select using (true);
create policy "Public insert content" on public.content for insert with check (true);
create policy "Public update content" on public.content for update using (true);
create policy "Public delete content" on public.content for delete using (true);

-- ─── 4. Realtime ─────────────────────────────────────────────────────────────

alter publication supabase_realtime add table public.orders;

-- ─── 5. Storage Bucket & Policies ────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  52428800, -- 50 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/bmp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/bmp'];

drop policy if exists "Public read product-images" on storage.objects;
drop policy if exists "Authenticated upload product-images" on storage.objects;
drop policy if exists "Authenticated update product-images" on storage.objects;
drop policy if exists "Authenticated delete product-images" on storage.objects;
drop policy if exists "Public upload product-images" on storage.objects;
drop policy if exists "Public update product-images" on storage.objects;
drop policy if exists "Public delete product-images" on storage.objects;

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
