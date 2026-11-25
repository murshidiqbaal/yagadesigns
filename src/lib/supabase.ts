import { createClient } from '@supabase/supabase-js';

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key',
  bucketId: import.meta.env.VITE_SUPABASE_BUCKET_ID || 'product-images',
};

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

export const PRODUCTS_TABLE = 'products';
export const PORTFOLIO_TABLE = 'portfolio';
export const TESTIMONIALS_TABLE = 'testimonials';
export const OFFERS_TABLE = 'offers';
export const ORDERS_TABLE = 'orders';
export const CONTENT_TABLE = 'content';

export interface Order {
  $id: string;
  id?: string;
  order_id: string;
  customer_name: string;
  phone_number: string;
  email?: string;
  wedding_date?: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  selected_color?: string;
  selected_size?: string;
  quantity?: number;
  customization_notes?: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface ProductVariant {
  color: string;
  images: string[];
  thumbnail?: string;
}

export interface Reel {
  link: string;
  thumbnail: string;
}

export interface Product {
  $id: string;
  id?: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  image_urls?: string[];
  price?: string;
  colors?: string[];
  fabric?: string;
  embroidery?: string;
  occasion?: string;
  is_customizable?: boolean;
  variants?: string | ProductVariant[];
  enquiry_count?: number;
  like_count?: number;
  instagram_reel_link?: string;
  reel_thumbnail?: string;
  reels?: string | Reel[];
  is_exclusive?: boolean;
  exclusive_badge?: string;
  created_at: string;
}

export interface PortfolioItem {
  $id: string;
  id?: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  created_at: string;
}

export interface Testimonial {
  $id: string;
  id?: string;
  name: string;
  content: string;
  rating: number;
  avatar_url?: string;
  is_featured?: boolean;
  created_at?: string;
}

export interface Offer {
  $id: string;
  id?: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  button_text?: string;
  link?: string;
  isActive: boolean;
  created_at?: string;
}

export interface SiteContent {
  id: string;
  title?: string;
  subtitle?: string;
  button_text?: string;
  image_url?: string;
  services_data?: unknown;
  updated_at?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
  ) as Partial<T>;
}

function parseJsonField<T>(value: unknown): T | undefined {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }
  return value as T;
}

function mapProduct(row: any): Product {
  return {
    ...row,
    $id: row.$id ?? row.id,
    variants: parseJsonField<ProductVariant[]>(row.variants) ?? row.variants,
    reels: parseJsonField<Reel[]>(row.reels) ?? row.reels,
  };
}

function mapOffer(row: any): Offer {
  const { is_active, ...rest } = row;
  return {
    ...rest,
    $id: row.$id ?? row.id,
    isActive: row.isActive ?? is_active ?? true,
  };
}

function mapWithId<T extends { $id: string }>(row: any): T {
  return {
    ...row,
    $id: row.$id ?? row.id,
  } as T;
}

// ─── Product CRUD ────────────────────────────────────────────────────────────

export async function getProducts(category?: string): Promise<Product[]> {
  try {
    let query = supabase
      .from(PRODUCTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(mapProduct);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? mapProduct(data) : null;
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    return null;
  }
}

export async function addProduct(product: Omit<Product, '$id'>): Promise<Product> {
  const { id: _id, ...rest } = product as any;
  const payload = stripUndefined({
    ...rest,
    created_at: product.created_at || new Date().toISOString(),
    variants: typeof product.variants === 'string' ? parseJsonField(product.variants) : product.variants,
    reels: typeof product.reels === 'string' ? parseJsonField(product.reels) : product.reels,
  });

  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return mapProduct(data);
}

export async function updateProduct(id: string, data: Partial<Omit<Product, '$id'>>): Promise<Product> {
  const { id: _id, $id: _$id, ...rest } = data as any;
  const payload = stripUndefined({
    ...rest,
    variants: typeof data.variants === 'string' ? parseJsonField(data.variants) : data.variants,
    reels: typeof data.reels === 'string' ? parseJsonField(data.reels) : data.reels,
  });

  const { data: updated, error } = await supabase
    .from(PRODUCTS_TABLE)
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapProduct(updated);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from(PRODUCTS_TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function trackProductEnquiry(id: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_product_enquiry', {
      p_product_id: id,
    });
    if (error) throw error;
  } catch (error) {
    console.error('Failed to track enquiry:', error);
  }
}

export async function trackProductLike(id: string, increment: boolean): Promise<void> {
  try {
    const { error } = await supabase.rpc('toggle_product_like', {
      p_product_id: id,
      p_increment: increment,
    });
    if (error) throw error;
  } catch (error) {
    console.error('Failed to track like:', error);
  }
}

// ─── Portfolio ───────────────────────────────────────────────────────────────

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const { data, error } = await supabase
      .from(PORTFOLIO_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return (data || []).map((row) => mapWithId<PortfolioItem>(row));
  } catch (error) {
    console.error('Failed to fetch portfolio items:', error);
    return [];
  }
}

export async function addPortfolioItem(item: Omit<PortfolioItem, '$id'>): Promise<PortfolioItem> {
  const { id: _id, ...rest } = item as any;
  const payload = stripUndefined({
    ...rest,
    created_at: item.created_at || new Date().toISOString(),
  });

  const { data, error } = await supabase
    .from(PORTFOLIO_TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return mapWithId<PortfolioItem>(data);
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const { error } = await supabase.from(PORTFOLIO_TABLE).delete().eq('id', id);
  if (error) throw error;
}

// ─── Testimonials ────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabase
      .from(TESTIMONIALS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return (data || []).map((row) => mapWithId<Testimonial>(row));
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return [];
  }
}

export async function createTestimonial(testimonial: Omit<Testimonial, '$id'>): Promise<Testimonial> {
  const { id: _id, ...rest } = testimonial as any;
  const payload = stripUndefined({
    ...rest,
    created_at: new Date().toISOString(),
  });

  const { data, error } = await supabase
    .from(TESTIMONIALS_TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return mapWithId<Testimonial>(data);
}

export async function updateTestimonial(id: string, data: Partial<Omit<Testimonial, '$id'>>): Promise<Testimonial> {
  const { id: _id, $id: _$id, ...rest } = data as any;
  const { data: updated, error } = await supabase
    .from(TESTIMONIALS_TABLE)
    .update(stripUndefined(rest))
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapWithId<Testimonial>(updated);
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from(TESTIMONIALS_TABLE).delete().eq('id', id);
  if (error) throw error;
}

// ─── Offers ──────────────────────────────────────────────────────────────────

export async function getOffers(): Promise<Offer[]> {
  try {
    const { data, error } = await supabase
      .from(OFFERS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return (data || []).map(mapOffer);
  } catch (error) {
    console.error('Failed to fetch offers:', error);
    return [];
  }
}

export async function getActiveOffer(): Promise<Offer | null> {
  try {
    const { data, error } = await supabase
      .from(OFFERS_TABLE)
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data && data.length > 0 ? mapOffer(data[0]) : null;
  } catch (error) {
    console.error('Failed to fetch active offer:', error);
    return null;
  }
}

export async function createOffer(offer: Omit<Offer, '$id'>): Promise<Offer> {
  const { id: _id, isActive, ...rest } = offer as any;
  const payload = stripUndefined({
    ...rest,
    is_active: isActive ?? true,
    created_at: new Date().toISOString(),
  });

  const { data, error } = await supabase
    .from(OFFERS_TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return mapOffer(data);
}

export async function updateOffer(id: string, data: Partial<Omit<Offer, '$id'>>): Promise<Offer> {
  const { id: _id, $id: _$id, isActive, ...rest } = data as any;
  const payload = stripUndefined({
    ...rest,
    ...(isActive !== undefined ? { is_active: isActive } : {}),
  });

  const { data: updated, error } = await supabase
    .from(OFFERS_TABLE)
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapOffer(updated);
}

export async function deleteOffer(id: string): Promise<void> {
  const { error } = await supabase.from(OFFERS_TABLE).delete().eq('id', id);
  if (error) throw error;
}

// ─── Site Content (Hero, Services) ───────────────────────────────────────────

export async function getSiteContent(id: string): Promise<SiteContent | null> {
  try {
    const { data, error } = await supabase
      .from(CONTENT_TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as SiteContent | null;
  } catch (error) {
    console.error(`Failed to fetch content "${id}":`, error);
    return null;
  }
}

export async function upsertSiteContent(
  id: string,
  payload: Omit<SiteContent, 'id' | 'updated_at'>
): Promise<SiteContent> {
  const { data, error } = await supabase
    .from(CONTENT_TABLE)
    .upsert(
      stripUndefined({
        id,
        ...payload,
        updated_at: new Date().toISOString(),
      }),
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data as SiteContent;
}

// ─── Storage ─────────────────────────────────────────────────────────────────

/**
 * Converts a File (image) to WebP format using a Canvas.
 * This ensures all uploads are optimized.
 */
async function convertToWebP(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to convert to WebP'));
              return;
            }
            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.webp', {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(webpFile);
          },
          'image/webp',
          0.8
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadProductImage(file: File): Promise<string> {
  let finalFile = file;

  // Convert to WebP if it's a JPEG, PNG, or BMP (avoiding SVGs, GIFs, and already WebP files)
  const mime = file.type.toLowerCase();
  const shouldConvert = mime === 'image/jpeg' || mime === 'image/png' || mime === 'image/bmp';
  if (shouldConvert) {
    try {
      finalFile = await convertToWebP(file);
    } catch (e) {
      console.error('WebP conversion failed, uploading original:', e);
    }
  }

  const sanitizedName = finalFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniquePrefix =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const filePath = `${uniquePrefix}-${sanitizedName}`;

  const { error } = await supabase.storage
    .from(supabaseConfig.bucketId)
    .upload(filePath, finalFile, {
      contentType: finalFile.type || undefined,
      upsert: false,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from(supabaseConfig.bucketId)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

/**
 * Helper to get a valid image URL.
 * If the input is already a full URL, it returns it.
 * If it's a storage path, it resolves the Supabase public URL.
 */
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;

  const { data } = supabase.storage.from(supabaseConfig.bucketId).getPublicUrl(imagePath);
  return data.publicUrl;
}

export async function deleteProductImage(filePathOrUrl: string): Promise<void> {
  if (!filePathOrUrl) return;
  let path = filePathOrUrl;
  const marker = `/storage/v1/object/public/${supabaseConfig.bucketId}/`;
  const idx = filePathOrUrl.indexOf(marker);
  if (idx !== -1) {
    path = filePathOrUrl.slice(idx + marker.length);
  }
  const { error } = await supabase.storage.from(supabaseConfig.bucketId).remove([path]);
  if (error) throw error;
}

// ─── System Status ───────────────────────────────────────────────────────────

export async function checkSystemStatus() {
  try {
    const { error } = await supabase.from(PRODUCTS_TABLE).select('id').limit(1);
    if (error) {
      return { database: false, products: false };
    }
    return { database: true, products: true };
  } catch {
    return { database: false, products: false };
  }
}

// ─── Orders CRUD ─────────────────────────────────────────────────────────────

export async function createOrder(
  order: Omit<Order, '$id' | 'created_at' | 'status'> & { status?: string }
): Promise<Order> {
  const { id: _id, ...rest } = order as any;
  const payload = stripUndefined({
    ...rest,
    status: order.status || 'New',
    created_at: new Date().toISOString(),
  });

  const { data, error } = await supabase
    .from(ORDERS_TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return mapWithId<Order>(data);
}

export async function getOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from(ORDERS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return (data || []).map((row) => mapWithId<Order>(row));
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from(ORDERS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? mapWithId<Order>(data) : null;
  } catch (error) {
    console.error('Failed to fetch order by ID:', error);
    return null;
  }
}

export async function getOrderByOrderId(orderId: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from(ORDERS_TABLE)
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle();

    if (error) throw error;
    return data ? mapWithId<Order>(data) : null;
  } catch (error) {
    console.error('Failed to fetch order by order_id:', error);
    return null;
  }
}

export async function updateOrderStatus(id: string, status: string): Promise<Order> {
  const { data, error } = await supabase
    .from(ORDERS_TABLE)
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapWithId<Order>(data);
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from(ORDERS_TABLE).delete().eq('id', id);
  if (error) throw error;
}

export function subscribeToOrders(
  onUpdate: (order: Order) => void,
  onDelete: (orderId: string) => void
): () => void {
  const channel = supabase
    .channel('orders-realtime')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: ORDERS_TABLE },
      (payload) => {
        if (payload.new) {
          onUpdate(mapWithId<Order>(payload.new));
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: ORDERS_TABLE },
      (payload) => {
        const deletedId = (payload.old as any)?.id ?? (payload.old as any)?.$id;
        if (deletedId) {
          onDelete(deletedId);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
