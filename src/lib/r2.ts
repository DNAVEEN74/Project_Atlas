/**
 * Cloudflare R2 Storage Utility
 * S3-compatible storage for question/option images
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize R2 client
const r2Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'project-atlas-images';

export interface UploadResult {
    success: boolean;
    key?: string;
    url?: string;
    error?: string;
}

/**
 * Upload an image to R2
 * @param file - Buffer or Uint8Array of the image
 * @param fileName - Name for the file (e.g., "q1_main.png")
 * @param contentType - MIME type (e.g., "image/png")
 * @param folder - Optional folder path (e.g., "questions/2024")
 */
export async function uploadImage(
    file: Buffer | Uint8Array,
    fileName: string,
    contentType: string = 'image/png',
    folder: string = 'questions'
): Promise<UploadResult> {
    try {
        const key = `${folder}/${fileName}`;

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file,
            ContentType: contentType,
        });

        await r2Client.send(command);

        // Generate URL (uses R2_PUBLIC_URL if set, otherwise endpoint)
        const publicUrl = process.env.R2_PUBLIC_URL;
        const url = publicUrl
            ? `${publicUrl}/${key}`
            : `${process.env.R2_ENDPOINT}/${BUCKET_NAME}/${key}`;

        return {
            success: true,
            key,
            url,
        };
    } catch (error) {
        console.error('R2 upload error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        };
    }
}

/**
 * Delete an image from R2
 */
export async function deleteImage(key: string): Promise<boolean> {
    try {
        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        await r2Client.send(command);
        return true;
    } catch (error) {
        console.error('R2 delete error:', error);
        return false;
    }
}

/**
 * Generate a unique filename for question images
 */
export function generateImageKey(
    questionId: string,
    type: 'question' | 'option',
    optionId?: string
): string {
    const timestamp = Date.now();
    if (type === 'question') {
        return `q_${questionId}_main_${timestamp}.png`;
    }
    return `q_${questionId}_${optionId}_${timestamp}.png`;
}
