import { Client, Storage, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const config = {
    endpoint: 'https://sgp.cloud.appwrite.io/v1',
    projectId: process.env.VITE_APPWRITE_PROJECT_ID || '69d72e170037ae85ba57',
    apiKey: process.env.APPWRITE_API_KEY,
    bucketId: 'product-images',
};

async function fixStorage() {
    if (!config.apiKey) {
        console.error('❌ APPWRITE_API_KEY is missing in .env');
        return;
    }

    const client = new Client()
        .setEndpoint(config.endpoint)
        .setProject(config.projectId)
        .setKey(config.apiKey);

    const storage = new Storage(client);

    try {
        console.log(`🔧 Updating permissions for bucket: ${config.bucketId}...`);
        await storage.updateBucket(
            config.bucketId,
            'Product Images', // Name
            [
                Permission.read(Role.any()),      // Everyone can VIEW
                Permission.create(Role.users()),    // Logged in users can UPLOAD
                Permission.update(Role.users()),    // Logged in users can UPDATE
                Permission.delete(Role.users()),    // Logged in users can DELETE
            ],
            true, // fileSecurity 
            true, // enabled
            50000000, // maximumFileSize (50MB)
            ['jpg', 'png', 'webp', 'jpeg', 'svg'], // Allowed extensions (added svg)
            undefined, // Compression
            true, // Encryption
            true // Antivirus
        );
        console.log('✅ Storage permissions updated successfully!');
    } catch (e) {
        console.error('❌ Failed to update storage permissions:', e.message);
    }
}

fixStorage();
