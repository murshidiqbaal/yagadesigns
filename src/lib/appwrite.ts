import { Client, Databases, Query } from 'appwrite';

const client = new Client()
  .setEndpoint('https://sgp.cloud.appwrite.io/v1')
  .setProject('69d72e170037ae85ba57');

export const databases = new Databases(client);

export const DATABASE_ID = 'luxevibes_db';
export const PORTFOLIO_COLLECTION = 'portfolio';
export const TESTIMONIALS_COLLECTION = 'testimonials';

export interface PortfolioItem {
  $id: string;
  title: string;
  image_url: string;
  category: string;
  description: string;
  created_at: string;
}

export interface Testimonial {
  $id: string;
  name: string;
  message: string;
  rating: number;
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PORTFOLIO_COLLECTION,
      [Query.orderDesc('created_at'), Query.limit(50)]
    );
    return response.documents as unknown as PortfolioItem[];
  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      TESTIMONIALS_COLLECTION,
      [Query.limit(20)]
    );
    return response.documents as unknown as Testimonial[];
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return [];
  }
}
