/**
 * Yaga Designs — Appwrite Database Setup Script
 *
 * Run with:  node setup-db.js
 *
 * Prerequisites:
 *   npm install node-appwrite dotenv
 *
 * Env vars needed (.env):
 *   APPWRITE_API_KEY   — Server API key with full permissions
 *   VITE_APPWRITE_PROJECT_ID  (optional, falls back to hardcoded)
 */

import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

// ─── Configuration ────────────────────────────────────────────────────────────

const CONFIG = {
  endpoint:   'https://sgp.cloud.appwrite.io/v1',
  projectId:  process.env.VITE_APPWRITE_PROJECT_ID || '69d72e170037ae85ba57',
  apiKey:     process.env.APPWRITE_API_KEY,
  databaseId: 'yaga-db',
  bucketId:   'product-images',
  bucketName: 'Product Images',
};

// Standard public-read / user-write permissions
const PUBLIC_PERMISSIONS = [
  Permission.read(Role.any()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

// ─── Schema Definition ────────────────────────────────────────────────────────

const COLLECTIONS = [
  {
    id: 'products',
    name: 'Products',
    attributes: [
      // Core
      { key: 'name',               type: 'string',   size: 255,   required: true  },
      { key: 'description',        type: 'string',   size: 5000,  required: false },
      { key: 'category',           type: 'string',   size: 100,   required: true  },
      { key: 'price',              type: 'string',   size: 100,   required: false },
      // Images
      { key: 'image_url',          type: 'string',   size: 2048,  required: false },
      { key: 'image_urls',         type: 'string',   size: 2048,  required: false, array: true },
      // Details
      { key: 'fabric',             type: 'string',   size: 255,   required: false },
      { key: 'embroidery',         type: 'string',   size: 255,   required: false },
      { key: 'occasion',           type: 'string',   size: 100,   required: false },
      { key: 'colors',             type: 'string',   size: 100,   required: false, array: true },
      { key: 'is_customizable',    type: 'boolean',  required: false, default: true  },
      // Variants (stored as JSON string)
      { key: 'variants',           type: 'string',   size: 50000, required: false },
      // Analytics
      { key: 'enquiry_count',      type: 'integer',  required: false, min: 0, default: 0 },
      { key: 'like_count',         type: 'integer',  required: false, min: 0, default: 0 },
      // Instagram Reel
      { key: 'instagram_reel_link', type: 'string',  size: 1024,  required: false },
      { key: 'reel_thumbnail',     type: 'string',   size: 2048,  required: false },
      { key: 'reels',              type: 'string',   size: 5000,  required: false },
      // Timestamps
      { key: 'created_at',         type: 'datetime', required: false },
    ],
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    attributes: [
      { key: 'title',       type: 'string',   size: 255,  required: true  },
      { key: 'description', type: 'string',   size: 2000, required: false },
      { key: 'category',    type: 'string',   size: 100,  required: false },
      { key: 'image_url',   type: 'string',   size: 2048, required: true  },
      { key: 'created_at',  type: 'datetime', required: false },
    ],
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    attributes: [
      { key: 'name',        type: 'string',  size: 100,  required: true  },
      { key: 'content',     type: 'string',  size: 2000, required: true  },
      { key: 'rating',      type: 'integer', required: true,  min: 1, max: 5 },
      { key: 'avatar_url',  type: 'string',  size: 2048, required: false },
      { key: 'is_featured', type: 'boolean', required: false, default: false },
      { key: 'created_at',  type: 'datetime', required: false },
    ],
  },
  {
    id: 'offers',
    name: 'Offers',
    attributes: [
      { key: 'title',       type: 'string',  size: 255,  required: true  },
      { key: 'subtitle',    type: 'string',  size: 500,  required: false },
      { key: 'image_url',   type: 'string',  size: 2048, required: false },
      { key: 'button_text', type: 'string',  size: 100,  required: false },
      { key: 'link',        type: 'string',  size: 1024, required: false },
      { key: 'isActive',    type: 'boolean', required: false, default: true },
      { key: 'created_at',  type: 'datetime', required: false },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(icon, msg) {
  console.log(`${icon}  ${msg}`);
}

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Create an attribute. Skips (409) if it already exists.
 */
async function createAttribute(databases, databaseId, collectionId, attr) {
  const label = `${collectionId}.${attr.key}`;
  try {
    process.stdout.write(`         ${attr.key.padEnd(25)} `);

    switch (attr.type) {
      case 'string':
        await databases.createStringAttribute(
          databaseId, collectionId, attr.key,
          attr.size, attr.required ?? false,
          attr.default ?? undefined, attr.array ?? false
        );
        break;
      case 'integer':
        await databases.createIntegerAttribute(
          databaseId, collectionId, attr.key,
          attr.required ?? false,
          attr.min ?? undefined, attr.max ?? undefined,
          attr.default ?? undefined
        );
        break;
      case 'boolean':
        await databases.createBooleanAttribute(
          databaseId, collectionId, attr.key,
          attr.required ?? false,
          attr.default ?? undefined
        );
        break;
      case 'datetime':
        await databases.createDatetimeAttribute(
          databaseId, collectionId, attr.key,
          attr.required ?? false
        );
        break;
      default:
        console.log(`⚠️  Unknown type "${attr.type}"`);
        return;
    }

    console.log('✅ created');
  } catch (e) {
    if (e.code === 409) {
      console.log('⏭️  already exists');
    } else {
      console.log(`❌ ERROR: ${e.message}`);
    }
  }
}

// ─── Main Setup ───────────────────────────────────────────────────────────────

async function setup() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   Yaga Designs — Appwrite DB Setup       ║');
  console.log('╚══════════════════════════════════════════╝\n');

  if (!CONFIG.apiKey) {
    console.error('❌  APPWRITE_API_KEY is not set in your .env file.\n');
    process.exit(1);
  }

  const client = new Client()
    .setEndpoint(CONFIG.endpoint)
    .setProject(CONFIG.projectId)
    .setKey(CONFIG.apiKey);

  const databases = new Databases(client);
  const storage   = new Storage(client);

  // ── 1. Database ──────────────────────────────────────────────────────────
  log('📁', `Database: ${CONFIG.databaseId}`);
  try {
    await databases.create(CONFIG.databaseId, 'Yaga Designs DB');
    log('✅', 'Database created.');
  } catch (e) {
    if (e.code === 409) log('⏭️', 'Database already exists.');
    else { console.error('❌', e.message); process.exit(1); }
  }

  // ── 2. Storage Bucket ────────────────────────────────────────────────────
  console.log('');
  log('📦', `Storage bucket: ${CONFIG.bucketId}`);
  try {
    await storage.createBucket(
      CONFIG.bucketId,
      CONFIG.bucketName,
      PUBLIC_PERMISSIONS,
      false,   // fileSecurity
      true,    // enabled
      undefined,               // maximumFileSize (no limit)
      ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      'none',  // compression
      true,    // encryption
      true     // antivirus
    );
    log('✅', 'Bucket created.');
  } catch (e) {
    if (e.code === 409) log('⏭️', 'Bucket already exists.');
    else log('⚠️', `Bucket warning: ${e.message}`);
  }

  // ── 3. Collections & Attributes ──────────────────────────────────────────
  for (const coll of COLLECTIONS) {
    console.log('');
    log('📋', `Collection: ${coll.name} (${coll.id})`);

    // Create collection
    try {
      await databases.createCollection(
        CONFIG.databaseId, coll.id, coll.name,
        PUBLIC_PERMISSIONS
      );
      log('✅', 'Collection created.');
    } catch (e) {
      if (e.code === 409) log('⏭️', 'Collection already exists.');
      else { console.error('❌ Fatal:', e.message); process.exit(1); }
    }

    // Wait for Appwrite to propagate the collection before adding attributes
    await wait(1500);

    log('🔧', `Adding ${coll.attributes.length} attributes...`);
    for (const attr of coll.attributes) {
      await createAttribute(databases, CONFIG.databaseId, coll.id, attr);
      // Small delay between attributes to avoid rate-limit errors
      await wait(300);
    }
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   ✅  Setup complete!                    ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`
Next steps:
  1. Open Appwrite Console → your project
  2. Confirm all collections and attributes are visible
  3. Add manual attributes if any failed (409 = already existed, which is fine)
  4. Run your app:  npm run dev
`);
}

setup().catch(err => {
  console.error('\n❌ Unexpected error:', err.message);
  process.exit(1);
});
