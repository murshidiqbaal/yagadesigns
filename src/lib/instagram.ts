export type InstagramMediaType = 'image' | 'video';

export interface InstagramPost {
  id: string;
  media_url: string;
  preview_url: string;
  media_type: InstagramMediaType;
  permalink: string;
  shortcode: string | null;
  caption: string;
  timestamp: string | null;
  aspect_ratio: number | null;
  is_new?: boolean;
  is_featured?: boolean;
}

export interface InstagramFeedResponse {
  ok: boolean;
  username: string;
  profile_url: string;
  source: string | null;
  last_attempt_at: string | null;
  last_fetched_at: string | null;
  latest_post_id: string | null;
  newest_post_id: string | null;
  new_post_detected_at: string | null;
  stale: boolean;
  error: string | null;
  featured_post: InstagramPost | null;
  posts: InstagramPost[];
  reels: InstagramPost[];
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function getInstagramFeed(): Promise<InstagramFeedResponse> {
  const response = await fetch(`${API_BASE_URL}/api/instagram`, {
    headers: {
      Accept: 'application/json',
    },
  });

  const payload = await response.json().catch(() => null);

  if (!payload) {
    throw new Error('Instagram showcase is temporarily unavailable.');
  }

  if (!response.ok) {
    throw new Error(payload.error || 'Instagram showcase is temporarily unavailable.');
  }

  if (!payload.ok && (!payload.posts || payload.posts.length === 0)) {
    throw new Error(payload.error || 'Instagram showcase is temporarily unavailable.');
  }

  return payload as InstagramFeedResponse;
}
