/**
 * Yaga Designs - Database Setup Script
 * Sets up the Appwrite database and collection programmatically.
 * 
 * Instructions:
 * 1. Install dependencies: npm install node-appwrite dotenv
 * 2. Create a .env file with your PROJECT_ID and APPWRITE_API_KEY
 * 3. Run: node setup-db.js
 */

import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

// Configuration
const config = {
    endpoint: 'https://sgp.cloud.appwrite.io/v1',
    projectId: process.env.VITE_APPWRITE_PROJECT_ID || '69d72e170037ae85ba57',
    apiKey: process.env.APPWRITE_API_KEY, // REQUIRED: Create an API key in Appwrite Console
    databaseId: 'yaga-db',
    collectionId: 'products',
    collectionName: 'Products',
    bucketId: 'product-images',
    bucketName: 'Product Images'
};

async function setup() {
    if (!config.apiKey) {
        console.error('❌ Error: APPWRITE_API_KEY is missing in .env file.');
        console.log('Please create an API key in Appwrite Console with databases.write, collections.write, and attributes.write permissions.');
        process.exit(1);
    }

    const client = new Client()
        .setEndpoint(config.endpoint)
        .setProject(config.projectId)
        .setKey(config.apiKey);

    const databases = new Databases(client);
    const storage = new Storage(client);

    try {
        // 1. Create Database
        console.log(`\n📁 Creating database: ${config.databaseId}...`);
        try {
            await databases.create(config.databaseId, config.databaseId);
            console.log('✅ Database created successfully.');
        } catch (e) {
            if (e.code === 409) console.log('ℹ️ Database already exists.');
            else throw e;
        }

        // 2. Create Collection
        console.log(`\n📋 Creating collection: ${config.collectionId}...`);
        try {
            await databases.createCollection(
                config.databaseId,
                config.collectionId,
                config.collectionName,
                [
                    Permission.read(Role.any()), // Public can view products
                    Permission.create(Role.users()), // Logged in users can create
                    Permission.update(Role.users()), // Logged in users can update
                    Permission.delete(Role.users()), // Logged in users can delete
                ]
            );
            console.log('✅ Collection created successfully.');
        } catch (e) {
            if (e.code === 409) console.log('ℹ️ Collection already exists.');
            else throw e;
        }

        // Wait a moment for collection to be ready
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 3. Create Storage Bucket
        console.log(`\n📦 Creating bucket: ${config.bucketId}...`);
        try {
            await storage.createBucket(
                config.bucketId,
                config.bucketName,
                [
                    Permission.read(Role.any()), // Public can view images
                    Permission.create(Role.users()), // Authenticated users can upload
                    Permission.update(Role.users()), // Authenticated users can update
                    Permission.delete(Role.users()), // Authenticated users can delete
                ],
                false, // File Security disabled (easier for public viewing)
                true, // Enabled
                undefined, // Max Size
                ['jpg', 'png', 'webp', 'jpeg'], // Allowed extensions
                undefined, // Compression
                true, // Encryption
                true // Antivirus
            );
            console.log('✅ Bucket created successfully.');
        } catch (e) {
            if (e.code === 409) console.log('ℹ️ Bucket already exists.');
            else {
                console.warn('⚠️ Bucket creation failed:', e.message);
                // Continue anyway as it might just be a permission issue in the setup script but bucket exists
            }
        }

        // 4. Create Attributes
        console.log('\n🛠️ Adding attributes...');

        const attributes = [
            { id: 'name', type: 'string', size: 255, required: true },
            { id: 'description', type: 'string', size: 2000, required: false },
            { id: 'category', type: 'string', size: 100, required: true },
            { id: 'image_url', type: 'string', size: 500, required: false }, // Keep for legacy/main
            { id: 'image_urls', type: 'string', size: 500, required: false, array: true },
            { id: 'price', type: 'string', size: 100, required: false },
            { id: 'colors', type: 'string', size: 100, required: false, array: true },
            { id: 'fabric', type: 'string', size: 255, required: false },
            { id: 'embroidery', type: 'string', size: 255, required: false },
            { id: 'occasion', type: 'string', size: 100, required: false },
            { id: 'created_at', type: 'datetime', required: false }
        ];

        for (const attr of attributes) {
            try {
                process.stdout.write(`   Adding ${attr.id}... `);
                if (attr.type === 'string') {
                    await databases.createStringAttribute(
                        config.databaseId,
                        config.collectionId,
                        attr.id,
                        attr.size,
                        attr.required,
                        undefined, // Default placeholder
                        attr.array // Important: Support array attributes
                    );
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(
                        config.databaseId,
                        config.collectionId,
                        attr.id,
                        attr.required
                    );
                }
                console.log('Done');
            } catch (e) {
                if (e.code === 409) console.log('Already exists');
                else {
                    console.log('Error');
                    console.error(`   ❌ Failed to add attribute ${attr.id}:`, e.message);
                }
            }
        }

        console.log('\n🚀 Appwrite Database Setup Complete!');
        console.log('-------------------------------------------');
        console.log(`Database ID:   ${config.databaseId}`);
        console.log(`Collection ID: ${config.collectionId}`);
        console.log(`Bucket ID:     ${config.bucketId}`);
        console.log('-------------------------------------------');
        console.log('\nIMPORTANT: Remember to update your .env file with the database and collection IDs if they differ from your previous ones.');

    } catch (error) {
        console.error('\n❌ Fatal Error during setup:');
        console.error(error.message);
        process.exit(1);
    }
}

setup();
