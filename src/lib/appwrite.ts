import { Account, Client, Databases, ID, Query, Storage } from 'appwrite';

export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1',
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || '69d72e170037ae85ba57',
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || 'yaga_designs_db',
  productsCollectionId: import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID || 'products',
  portfolioCollectionId: import.meta.env.VITE_APPWRITE_PORTFOLIO_COLLECTION_ID || 'portfolio',
  testimonialsCollectionId: import.meta.env.VITE_APPWRITE_TESTIMONIALS_COLLECTION_ID || 'testimonials',
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

export interface Product {
  $id: string;
  name: string;
  description: string;
  category: string;
  image_url: string; // Keep for legacy/main
  image_urls?: string[]; // Multiple images for gallery
  price?: string;
  colors?: string[];
  fabric?: string;
  embroidery?: string;
  occasion?: string;
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
  message: string;
  rating: number;
}

// ─── Product CRUD ────────────────────────────────────────────────────────────

export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const queries: string[] = [Query.orderDesc('created_at'), Query.limit(100)];
    if (category && category !== 'All') {
      queries.push(Query.equal('category', category));
    }
    const response = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION, queries);
    return response.documents as unknown as Product[];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await databases.getDocument(DATABASE_ID, PRODUCTS_COLLECTION, id);
    return response as unknown as Product;
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    return null;
  }
}

export async function addProduct(product: Omit<Product, '$id'>): Promise<Product> {
  console.log('Final Product Payload:', product);
  return databases.createDocument(
    DATABASE_ID, PRODUCTS_COLLECTION, ID.unique(),
    { ...product, created_at: product.created_at || new Date().toISOString() }
  ) as unknown as Product;
}

export async function updateProduct(id: string, data: Partial<Omit<Product, '$id'>>): Promise<Product> {
  return databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION, id, data) as unknown as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION, id);
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
    const response = await databases.listDocuments(DATABASE_ID, TESTIMONIALS_COLLECTION, [Query.limit(50)]);
    return response.documents as unknown as Testimonial[];
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return [];
  }
}

// ─── Storage ─────────────────────────────────────────────────────────────────

export async function uploadProductImage(file: File): Promise<string> {
  const response = await storage.createFile(appwriteConfig.storageId, ID.unique(), file);

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
