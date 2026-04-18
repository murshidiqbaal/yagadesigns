/**
 * Yaga Designs - Database Setup Script
 * Sets up the Appwrite database and collections programmatically.
 */

import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

// Configuration
const config = {
    endpoint: 'https://sgp.cloud.appwrite.io/v1',
    projectId: process.env.VITE_APPWRITE_PROJECT_ID || '69d72e170037ae85ba57',
    apiKey: process.env.APPWRITE_API_KEY, 
    databaseId: 'yaga-db',
    bucketId: 'product-images',
    bucketName: 'Product Images'
};

const COLLECTIONS = [
    {
        id: 'products',
        name: 'Products',
        attributes: [
            { id: 'name', type: 'string', size: 255, required: true },
            { id: 'description', type: 'string', size: 2000, required: false },
            { id: 'category', type: 'string', size: 100, required: true },
            { id: 'image_url', type: 'string', size: 500, required: false },
            { id: 'image_urls', type: 'string', size: 500, required: false, array: true },
            { id: 'price', type: 'string', size: 100, required: false },
            { id: 'colors', type: 'string', size: 100, required: false, array: true },
            { id: 'fabric', type: 'string', size: 255, required: false },
            { id: 'embroidery', type: 'string', size: 255, required: false },
            { id: 'occasion', type: 'string', size: 100, required: false },
            { id: 'variants', type: 'string', size: 10000, required: false },
            { id: 'created_at', type: 'datetime', required: false }
        ]
    },
    {
        id: 'testimonials',
        name: 'Testimonials',
        attributes: [
            { id: 'name', type: 'string', size: 100, required: true },
            { id: 'content', type: 'string', size: 2000, required: true },
            { id: 'rating', type: 'integer', min: 1, max: 5, required: true },
            { id: 'avatar_url', type: 'string', size: 500, required: false },
            { id: 'is_featured', type: 'boolean', required: false, default: false },
            { id: 'created_at', type: 'datetime', required: false }
        ]
    },
    {
        id: 'offers',
        name: 'Offers',
        attributes: [
            { id: 'title', type: 'string', size: 255, required: true },
            { id: 'subtitle', type: 'string', size: 500, required: false },
            { id: 'image_url', type: 'string', size: 500, required: false },
            { id: 'button_text', type: 'string', size: 100, required: false },
            { id: 'link', type: 'string', size: 500, required: false },
            { id: 'isActive', type: 'boolean', required: false, default: true },
            { id: 'created_at', type: 'datetime', required: false }
        ]
    }
];

async function setup() {
    if (!config.apiKey) {
        console.error('❌ Error: APPWRITE_API_KEY is missing.');
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
        console.log(`\n📁 Checking database: ${config.databaseId}...`);
        try {
            await databases.create(config.databaseId, config.databaseId);
            console.log('✅ Database created.');
        } catch (e) {
            if (e.code === 409) console.log('ℹ️ Database exists.');
            else throw e;
        }

        // 2. Create Bucket
        console.log(`\n📦 Checking bucket: ${config.bucketId}...`);
        try {
            await storage.createBucket(
                config.bucketId,
                config.bucketName,
                [Permission.read(Role.any()), Permission.create(Role.users()), Permission.update(Role.users()), Permission.delete(Role.users())],
                false, true, undefined, ['jpg', 'png', 'webp', 'jpeg'], undefined, true, true
            );
            console.log('✅ Bucket created.');
        } catch (e) {
            if (e.code === 409) console.log('ℹ️ Bucket exists.');
        }

        // 3. Process Collections
        for (const coll of COLLECTIONS) {
            console.log(`\n📋 Processing collection: ${coll.name} (${coll.id})...`);
            try {
                await databases.createCollection(
                    config.databaseId,
                    coll.id,
                    coll.name,
                    [Permission.read(Role.any()), Permission.create(Role.users()), Permission.update(Role.users()), Permission.delete(Role.users())]
                );
                console.log(`   ✅ Collection ${coll.id} created.`);
            } catch (e) {
                if (e.code === 409) console.log(`   ℹ️ Collection ${coll.id} exists.`);
                else throw e;
            }

            // Wait for collection
            await new Promise(r => setTimeout(r, 1000));

            // Create Attributes
            for (const attr of coll.attributes) {
                try {
                    process.stdout.write(`      Adding ${attr.id}... `);
                    if (attr.type === 'string') {
                        await databases.createStringAttribute(config.databaseId, coll.id, attr.id, attr.size, attr.required, undefined, attr.array);
                    } else if (attr.type === 'integer') {
                        await databases.createIntegerAttribute(config.databaseId, coll.id, attr.id, attr.required, attr.min, attr.max);
                    } else if (attr.type === 'boolean') {
                        await databases.createBooleanAttribute(config.databaseId, coll.id, attr.id, attr.required, attr.default);
                    } else if (attr.type === 'datetime') {
                        await databases.createDatetimeAttribute(config.databaseId, coll.id, attr.id, attr.required);
                    }
                    console.log('Done');
                } catch (e) {
                    if (e.code === 409) console.log('Exists');
                    else console.log(`Error: ${e.message}`);
                }
            }
        }

        console.log('\n🚀 Setup Complete!');
    } catch (error) {
        console.error('\n❌ Fatal Error:', error.message);
        process.exit(1);
    }
}

setup();
