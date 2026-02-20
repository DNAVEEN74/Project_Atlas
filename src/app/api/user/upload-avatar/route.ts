import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, generateImageKey } from '@/lib/r2';
import dbConnect from '@/core/db/connect';
import User from '@/core/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'File must be an image' },
                { status: 400 }
            );
        }

        // Validate file size (e.g., 5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size must be less than 5MB' },
                { status: 400 }
            );
        }

        // Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique key for avatar
        const timestamp = Date.now();
        const fileName = `avatar_${authUser.userId}_${timestamp}.${file.type.split('/')[1]}`;

        // Upload to R2
        const result = await uploadImage(
            buffer,
            fileName,
            file.type,
            'avatars'
        );

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Upload failed' },
                { status: 500 }
            );
        }

        // Update User profile with new avatar URL
        await dbConnect();
        await User.findByIdAndUpdate(authUser.userId, {
            $set: { 'profile.avatar_url': result.url }
        });

        return NextResponse.json({
            success: true,
            url: result.url,
        });

    } catch (error) {
        console.error('Avatar upload error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
