import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, generateImageKey } from '@/lib/r2';
import { requireAdmin } from '@/lib/auth';

const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
    try {
        const { error: authError } = await requireAdmin();
        if (authError) return authError;

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const questionId = formData.get('questionId') as string;
        const type = formData.get('type') as 'question' | 'option';
        const optionId = formData.get('optionId') as string | undefined;

        if (!file || !questionId || !type) {
            return NextResponse.json(
                { error: 'Missing required fields: file, questionId, type' },
                { status: 400 }
            );
        }

        if (!ALLOWED_MIME_TYPES.has(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: png, jpeg, webp, gif' },
                { status: 400 }
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'File size must be less than 5MB' },
                { status: 400 }
            );
        }

        // Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique key
        const fileName = generateImageKey(questionId, type, optionId);

        // Upload to R2
        const result = await uploadImage(
            buffer,
            fileName,
            file.type || 'image/png',
            'questions/2024'
        );

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Upload failed' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            key: result.key,
            url: result.url,
        });
    } catch (error) {
        console.error('Upload API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
