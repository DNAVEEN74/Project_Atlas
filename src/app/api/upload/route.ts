import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, generateImageKey } from '@/lib/r2';

export async function POST(request: NextRequest) {
    try {
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
