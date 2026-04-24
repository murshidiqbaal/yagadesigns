import 'dotenv/config';

const INSTAGRAM_USERNAME = process.env.INSTAGRAM_USERNAME || 'yaga_designs';
const INSTAGRAM_PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_USERNAME}/`;
const LEGACY_JSON_URL = `${INSTAGRAM_PROFILE_URL}?__a=1&__d=dis`;
const WEB_PROFILE_URL = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${INSTAGRAM_USERNAME}`;
const POLL_INTERVAL_MS = Number(process.env.INSTAGRAM_POLL_INTERVAL_MS || 60 * 60 * 1000);
const MAX_ITEMS = Number(process.env.INSTAGRAM_MAX_ITEMS || 12);
const NEW_POST_WINDOW_MS = Number(process.env.INSTAGRAM_NEW_BADGE_WINDOW_MS || 48 * 60 * 60 * 1000);

const DEFAULT_HEADERS = {
  'User-Agent':
    process.env.INSTAGRAM_USER_AGENT ||
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  Accept: 'application/json,text/plain,*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: 'https://www.instagram.com/',
  'X-Requested-With': 'XMLHttpRequest',
};

const WEB_PROFILE_HEADERS = {
  ...DEFAULT_HEADERS,
  'X-IG-App-ID': '936619743392459',
  'X-ASBD-ID': '129477',
};

const instagramCache = {
  username: INSTAGRAM_USERNAME,
  profileUrl: INSTAGRAM_PROFILE_URL,
  source: null,
  lastAttemptAt: null,
  lastFetchedAt: null,
  latestPostId: null,
  newestPostId: null,
  newPostDetectedAt: null,
  stale: false,
  posts: [],
  reels: [],
  featuredPost: null,
  error: null,
};

let refreshPromise = null;
let pollingTimer = null;

async function fetchJson(url, headers) {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`Instagram responded with ${response.status} for ${url}`);
  }

  const raw = await response.text();

  if (!raw.trim()) {
    throw new Error(`Instagram returned an empty payload for ${url}`);
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Instagram payload was not valid JSON for ${url}: ${error.message}`);
  }
}

function getCaption(node) {
  return (
    node?.edge_media_to_caption?.edges?.[0]?.node?.text ||
    node?.caption ||
    node?.accessibility_caption ||
    ''
  );
}

function buildPermalink(node) {
  if (!node?.shortcode) {
    return INSTAGRAM_PROFILE_URL;
  }

  if (node.product_type === 'clips' || node.is_video) {
    return `https://www.instagram.com/reel/${node.shortcode}/`;
  }

  return `https://www.instagram.com/p/${node.shortcode}/`;
}

function normalizeNode(node) {
  if (!node?.id) {
    return null;
  }

  const firstChild = node?.edge_sidecar_to_children?.edges?.[0]?.node;
  const isVideo =
    Boolean(node.is_video) ||
    node?.product_type === 'clips' ||
    Boolean(node.video_url) ||
    Boolean(firstChild?.is_video);

  const mediaUrl =
    (isVideo ? node.video_url : null) ||
    node.display_url ||
    node.thumbnail_src ||
    node.thumbnail_url ||
    firstChild?.video_url ||
    firstChild?.display_url ||
    firstChild?.thumbnail_src ||
    null;

  const previewUrl =
    node.thumbnail_src ||
    node.thumbnail_url ||
    node.display_url ||
    firstChild?.thumbnail_src ||
    firstChild?.display_url ||
    mediaUrl;

  if (!mediaUrl) {
    return null;
  }

  return {
    id: String(node.id),
    media_url: mediaUrl,
    preview_url: previewUrl,
    media_type: isVideo ? 'video' : 'image',
    permalink: buildPermalink(node),
    shortcode: node.shortcode || null,
    caption: getCaption(node),
    timestamp: node.taken_at_timestamp
      ? new Date(node.taken_at_timestamp * 1000).toISOString()
      : null,
    aspect_ratio:
      node?.dimensions?.width && node?.dimensions?.height
        ? Number((node.dimensions.width / node.dimensions.height).toFixed(3))
        : null,
  };
}

function normalizeEdges(edges) {
  return (edges || [])
    .map((edge) => normalizeNode(edge?.node || edge))
    .filter(Boolean)
    .slice(0, MAX_ITEMS);
}

function extractPostsFromPayload(payload) {
  const user =
    payload?.graphql?.user ||
    payload?.data?.user ||
    payload?.user ||
    payload?.items?.[0]?.user ||
    null;

  const timelineEdges =
    user?.edge_owner_to_timeline_media?.edges ||
    payload?.data?.user?.edge_owner_to_timeline_media?.edges ||
    payload?.items ||
    [];

  return normalizeEdges(timelineEdges);
}

async function readInstagramFeed() {
  const sources = [
    {
      url: LEGACY_JSON_URL,
      headers: DEFAULT_HEADERS,
      source: 'legacy-public-json',
    },
    {
      url: WEB_PROFILE_URL,
      headers: WEB_PROFILE_HEADERS,
      source: 'web-profile-info',
    },
  ];

  const errors = [];

  for (const candidate of sources) {
    try {
      const payload = await fetchJson(candidate.url, candidate.headers);
      const posts = extractPostsFromPayload(payload);

      if (posts.length > 0) {
        return {
          posts,
          source: candidate.source,
        };
      }

      errors.push(`${candidate.source}: no posts found`);
    } catch (error) {
      errors.push(`${candidate.source}: ${error.message}`);
    }
  }

  throw new Error(errors.join(' | '));
}

function withBadges(posts) {
  const hasFreshNewPost =
    Boolean(instagramCache.newPostDetectedAt) &&
    Date.now() - Date.parse(instagramCache.newPostDetectedAt) < NEW_POST_WINDOW_MS;

  return posts.map((post, index) => ({
    ...post,
    is_new: hasFreshNewPost && post.id === instagramCache.newestPostId,
    is_featured: index === 0,
  }));
}

function snapshotCache() {
  const posts = withBadges(instagramCache.posts);
  const reels = posts.filter((post) => post.media_type === 'video');
  const featuredPost = posts[0] || null;

  return {
    username: instagramCache.username,
    profile_url: instagramCache.profileUrl,
    source: instagramCache.source,
    last_attempt_at: instagramCache.lastAttemptAt,
    last_fetched_at: instagramCache.lastFetchedAt,
    latest_post_id: instagramCache.latestPostId,
    newest_post_id: instagramCache.newestPostId,
    new_post_detected_at: instagramCache.newPostDetectedAt,
    stale: instagramCache.stale,
    error: instagramCache.error,
    featured_post: featuredPost,
    posts,
    reels,
  };
}

export async function refreshInstagramCache(reason = 'manual') {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    instagramCache.lastAttemptAt = new Date().toISOString();

    try {
      const { posts, source } = await readInstagramFeed();
      const previousLatestId = instagramCache.latestPostId;
      const nextLatestId = posts[0]?.id || null;

      instagramCache.posts = posts;
      instagramCache.reels = posts.filter((post) => post.media_type === 'video');
      instagramCache.featuredPost = posts[0] || null;
      instagramCache.latestPostId = nextLatestId;
      instagramCache.lastFetchedAt = new Date().toISOString();
      instagramCache.source = source;
      instagramCache.stale = false;
      instagramCache.error = null;

      if (previousLatestId && nextLatestId && previousLatestId !== nextLatestId) {
        instagramCache.newestPostId = nextLatestId;
        instagramCache.newPostDetectedAt = instagramCache.lastFetchedAt;
        console.info(
          `[instagram] New post detected for ${INSTAGRAM_USERNAME}: ${nextLatestId} (${reason})`,
        );
      } else if (!instagramCache.newestPostId && nextLatestId) {
        instagramCache.newestPostId = nextLatestId;
      }

      return snapshotCache();
    } catch (error) {
      instagramCache.error = error.message;
      instagramCache.stale = instagramCache.posts.length > 0;

      if (instagramCache.posts.length > 0) {
        console.warn(`[instagram] Refresh failed, serving stale cache: ${error.message}`);
        return snapshotCache();
      }

      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export function getInstagramCache() {
  return snapshotCache();
}

export function startInstagramPolling() {
  if (pollingTimer) {
    return pollingTimer;
  }

  refreshInstagramCache('startup').catch((error) => {
    console.warn(`[instagram] Initial warm-up failed: ${error.message}`);
  });

  pollingTimer = setInterval(() => {
    refreshInstagramCache('interval').catch((error) => {
      console.warn(`[instagram] Interval refresh failed: ${error.message}`);
    });
  }, POLL_INTERVAL_MS);

  return pollingTimer;
}

export function stopInstagramPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}

export const INSTAGRAM_POLL_INTERVAL_MS = POLL_INTERVAL_MS;
