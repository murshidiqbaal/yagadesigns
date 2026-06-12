/**
 * Yaga Designs — Update Orders Collection Security
 * Run with: node update-security.js
 */

import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const CONFIG = {
  endpoint:   'https://sgp.cloud.appwrite.io/v1',
  projectId:  process.env.VITE_APPWRITE_PROJECT_ID || '69d72e170037ae85ba57',
  apiKey:     process.env.APPWRITE_API_KEY,
  databaseId: 'yaga-db',
  collectionId: 'orders',
};

async function run() {
  if (!CONFIG.apiKey) {
    console.error('❌  APPWRITE_API_KEY is not set in your .env file.');
    process.exit(1);
  }

  const client = new Client()
    .setEndpoint(CONFIG.endpoint)
    .setProject(CONFIG.projectId)
    .setKey(CONFIG.apiKey);

  const databases = new Databases(client);

  console.log('🔄 Updating orders collection security settings...');

  try {
    const permissions = [
      Permission.create(Role.any()),
      Permission.read(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ];

    // Update collection to enable document-level security (5th parameter set to true)
    await databases.updateCollection(
      CONFIG.CONFIG_DATABASE_ID || CONFIG.databaseId,
      CONFIG.collectionId,
      'Orders',
      permissions,
      true // Enable document security!
    );

    console.log('✅ Document Level Security successfully enabled on orders collection!');
  } catch (error) {
    console.error('❌ Failed to update collection:', error.message);
  }
}

run();
