import { Account, Client, Databases, ID, Query, Storage } from 'appwrite';

export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1',
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || '69d72e170037ae85ba57',
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || 'yaga-db',
  productsCollectionId: import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID || 'products',
  portfolioCollectionId: import.meta.env.VITE_APPWRITE_PORTFOLIO_COLLECTION_ID || 'portfolio',
  testimonialsCollectionId: import.meta.env.VITE_APPWRITE_TESTIMONIALS_COLLECTION_ID || 'testimonials',
  offersCollectionId: import.meta.env.VITE_APPWRITE_OFFERS_COLLECTION_ID || 'offers',
  collectionContentId: import.meta.env.VITE_APPWRITE_CONTENT_COLLECTION_ID || 'content',
  storageId: import.meta.env.VITE_APPWRITE_BUCKET_ID || 'product-images',
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);
export { ID };

export const DATABASE_ID = appwriteConfig.databaseId;
export const PRODUCTS_COLLECTION = appwriteConfig.productsCollectionId;
export const PORTFOLIO_COLLECTION = appwriteConfig.portfolioCollectionId;
export const TESTIMONIALS_COLLECTION = appwriteConfig.testimonialsCollectionId;
export const OFFERS_COLLECTION = appwriteConfig.offersCollectionId;

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
  name: string;
  description: string;
  category: string;
  image_url: string; // Keep for legacy/main
  image_urls?: string[]; // Optional for backward compatibility
  price?: string;
  colors?: string[]; // Optional for backward compatibility
  fabric?: string;
  embroidery?: string;
  occasion?: string;
  is_customizable?: boolean;
  variants?: string | ProductVariant[]; // Stored as JSON string in DB
  enquiry_count?: number;
  like_count?: number;
  instagram_reel_link?: string; // Kept for backward compatibility
  reel_thumbnail?: string;      // Kept for backward compatibility
  reels?: string | Reel[];      // Stored as JSON string
  created_at: string;
}

export interface PortfolioItem {
  $id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  created_at: string;
}

export interface Testimonial {
  $id: string;
  name: string;
  content: string;
  rating: number;
  avatar_url?: string;
  is_featured?: boolean;
  created_at?: string;
}

export interface Offer {
  $id: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  button_text?: string;
  link?: string;
  isActive: boolean;
  created_at?: string;
}

// ─── Product CRUD ────────────────────────────────────────────────────────────

/**
 * Remove keys with undefined/null values so Appwrite doesn't reject the payload.
 * Appwrite will throw "Unknown attribute" if you send a key it doesn't recognise,
 * and may throw on explicit `undefined` values too.
 */
function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
  ) as Partial<T>;
}

export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const queries: string[] = [Query.orderDesc('created_at'), Query.limit(100)];
    if (category && category !== 'All') {
      queries.push(Query.equal('category', category));
    }
    const response = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION, queries);
    
    // Parse JSON strings
    return response.documents.map((doc: any) => ({
      ...doc,
      variants: typeof doc.variants === 'string' ? JSON.parse(doc.variants) : doc.variants,
      reels: typeof doc.reels === 'string' ? JSON.parse(doc.reels) : doc.reels
    })) as Product[];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await databases.getDocument(DATABASE_ID, PRODUCTS_COLLECTION, id);
    const doc = response as any;
    return {
      ...doc,
      variants: typeof doc.variants === 'string' ? JSON.parse(doc.variants) : doc.variants,
      reels: typeof doc.reels === 'string' ? JSON.parse(doc.reels) : doc.reels
    } as Product;
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    return null;
  }
}

export async function addProduct(product: Omit<Product, '$id'>): Promise<Product> {
  console.log('Final Product Payload:', product);
  const payload = stripUndefined({
    ...product,
    created_at: product.created_at || new Date().toISOString(),
    variants: typeof product.variants === 'object' ? JSON.stringify(product.variants) : product.variants,
    reels: typeof product.reels === 'object' ? JSON.stringify(product.reels) : product.reels
  });
  return databases.createDocument(
    DATABASE_ID, PRODUCTS_COLLECTION, ID.unique(),
    payload
  ) as unknown as Product;
}

export async function updateProduct(id: string, data: Partial<Omit<Product, '$id'>>): Promise<Product> {
  const payload = stripUndefined({
    ...data,
    variants: typeof data.variants === 'object' ? JSON.stringify(data.variants) : data.variants,
    reels: typeof data.reels === 'object' ? JSON.stringify(data.reels) : data.reels
  });
  return databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION, id, payload) as unknown as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION, id);
}

export async function trackProductEnquiry(id: string): Promise<void> {
  try {
    const product = await getProductById(id);
    if (!product) return;
    const currentCount = product.enquiry_count || 0;
    await databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION, id, {
      enquiry_count: currentCount + 1
    });
  } catch (error) {
    console.error('Failed to track enquiry:', error);
  }
}

export async function trackProductLike(id: string, increment: boolean): Promise<void> {
  try {
    const product = await getProductById(id);
    if (!product) return;
    const currentCount = product.like_count || 0;
    const newCount = increment ? currentCount + 1 : Math.max(0, currentCount - 1);
    await databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION, id, {
      like_count: newCount
    });
  } catch (error) {
    console.error('Failed to track like:', error);
  }
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, PORTFOLIO_COLLECTION, [Query.orderDesc('created_at'), Query.limit(100)]);
    return response.documents as unknown as PortfolioItem[];
  } catch (error) {
    console.error('Failed to fetch portfolio items:', error);
    return [];
  }
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, TESTIMONIALS_COLLECTION, [Query.orderDesc('created_at'), Query.limit(50)]);
    return response.documents as unknown as Testimonial[];
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return [];
  }
}

export async function createTestimonial(testimonial: Omit<Testimonial, '$id'>): Promise<Testimonial> {
  const payload = { ...testimonial, created_at: new Date().toISOString() };
  return databases.createDocument(DATABASE_ID, TESTIMONIALS_COLLECTION, ID.unique(), payload) as unknown as Testimonial;
}

export async function updateTestimonial(id: string, data: Partial<Omit<Testimonial, '$id'>>): Promise<Testimonial> {
  return databases.updateDocument(DATABASE_ID, TESTIMONIALS_COLLECTION, id, data) as unknown as Testimonial;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await databases.deleteDocument(DATABASE_ID, TESTIMONIALS_COLLECTION, id);
}

// ─── Offers ───────────────────────────────────────────────────────────────────

export async function getOffers(): Promise<Offer[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, OFFERS_COLLECTION, [Query.orderDesc('created_at'), Query.limit(50)]);
    return response.documents as unknown as Offer[];
  } catch (error) {
    console.error('Failed to fetch offers:', error);
    return [];
  }
}

export async function getActiveOffer(): Promise<Offer | null> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, OFFERS_COLLECTION, [
      Query.equal('isActive', true),
      Query.orderDesc('created_at'),
      Query.limit(1)
    ]);
    return (response.documents[0] as unknown as Offer) || null;
  } catch (error) {
    console.error('Failed to fetch active offer:', error);
    return null;
  }
}

export async function createOffer(offer: Omit<Offer, '$id'>): Promise<Offer> {
  const payload = { ...offer, created_at: new Date().toISOString() };
  return databases.createDocument(DATABASE_ID, OFFERS_COLLECTION, ID.unique(), payload) as unknown as Offer;
}

export async function updateOffer(id: string, data: Partial<Omit<Offer, '$id'>>): Promise<Offer> {
  return databases.updateDocument(DATABASE_ID, OFFERS_COLLECTION, id, data) as unknown as Offer;
}

export async function deleteOffer(id: string): Promise<void> {
  await databases.deleteDocument(DATABASE_ID, OFFERS_COLLECTION, id);
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
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to convert to WebP'));
            return;
          }
          const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
            type: "image/webp",
            lastModified: Date.now()
          });
          resolve(webpFile);
        }, 'image/webp', 0.8); // 0.8 quality for good balance
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

  // Convert to WebP if it's an image
  if (file.type.startsWith('image/')) {
    try {
      console.log('Optimizing image to WebP...');
      finalFile = await convertToWebP(file);
    } catch (e) {
      console.error('WebP conversion failed, uploading original:', e);
    }
  }

  const response = await storage.createFile(appwriteConfig.storageId, ID.unique(), finalFile);

  // Construct a standard, clean view URL. 
  // We use the view URL (with project ID) which is most compatible with <img> tags.
  const url = `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.storageId}/files/${response.$id}/view?project=${appwriteConfig.projectId}`;

  console.log('File uploaded. Storing full URL:', url);
  return url;
}

/**
 * Helper to get a valid image URL. 
 * If the input is already a URL, it returns it. 
 * If it's a file ID, it generates an Appwrite preview URL.
 */
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '';

  // If it's already a full URL, return it
  if (imagePath.startsWith('http')) return imagePath;

  // If it's just a file ID (fallback for legacy or direct input), construct the preview URL
  try {
    return `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.storageId}/files/${imagePath}/preview?project=${appwriteConfig.projectId}&width=800`;
  } catch (e) {
    console.error('Failed to resolve image URL:', e);
    return imagePath;
  }
}

export async function deleteProductImage(fileId: string): Promise<void> {
  await storage.deleteFile(appwriteConfig.storageId, fileId);
}

// ─── System Status ────────────────────────────────────────────────────────────

export async function checkSystemStatus() {
  try {
    await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION, [Query.limit(1)]);
    return { database: true, products: true };
  } catch (e: any) {
    return { database: e.code !== 404, products: false };
  }
}
