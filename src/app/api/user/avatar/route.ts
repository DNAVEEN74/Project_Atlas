import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { uploadImage } from '@/lib/r2';
import dbConnect from '@/core/db/connect';
import User from '@/core/models/User';

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

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate key: avatars/userId_timestamp.ext
        const timestamp = Date.now();
        const extension = file.type.split('/')[1] || 'png';
        const fileName = `${authUser.userId}_${timestamp}.${extension}`;

        // Upload to R2
        const result = await uploadImage(
            buffer,
            fileName,
            file.type,
            'avatars'
        );

        if (!result.success || !result.url) {
            return NextResponse.json(
                { error: result.error || 'Upload failed' },
                { status: 500 }
            );
        }

        // Update User Profile
        await dbConnect();
        const user = await User.findById(authUser.userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        user.profile.avatar_url = result.url;
        await user.save();

        return NextResponse.json({
            success: true,
            avatar_url: result.url,
            message: 'Profile picture updated successfully'
        });

    } catch (error) {
        console.error('Avatar upload error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
