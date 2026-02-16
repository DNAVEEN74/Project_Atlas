import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import User from '@/core/models/User';
import { getCurrentUser } from '@/lib/auth';

// GET /api/sprint/configs - Fetch user's saved configurations
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const subject = searchParams.get('subject');

        const userDoc = await User.findById(user.userId).select('sprint_configs').lean();

        if (!userDoc) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        let configs = userDoc.sprint_configs || [];

        // Filter by subject if provided
        if (subject) {
            configs = configs.filter((c: any) => c.subject === subject);
        }

        // Sort by last_used (most recent first), then by created_at
        configs = configs.sort((a: any, b: any) => {
            if (a.last_used && b.last_used) {
                return new Date(b.last_used).getTime() - new Date(a.last_used).getTime();
            }
            if (a.last_used) return -1;
            if (b.last_used) return 1;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        return NextResponse.json({ success: true, configs });
    } catch (error) {
        console.error('Error fetching sprint configs:', error);
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}

// POST /api/sprint/configs - Save a new configuration
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, subject, topics, difficulty, question_count } = body;

        // Validation
        if (!name || !subject || !topics || !difficulty || !question_count) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields: name, subject, topics, difficulty, question_count'
            }, { status: 400 });
        }

        if (question_count < 5 || question_count > 20) {
            return NextResponse.json({
                success: false,
                error: 'Question count must be between 5 and 20'
            }, { status: 400 });
        }

        const userDoc = await User.findById(user.userId);
        if (!userDoc) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // Check if name already exists (globally or per subject? Let's keep names unique globally to avoid confusion, or per subject.
        // User requested separation. Let's allowing same name in different subjects is fine, but maybe confusing.
        // Let's enforce unique name per subject for now.
        const existingConfig = userDoc.sprint_configs.find((c: any) => c.name === name && c.subject === subject);
        if (existingConfig) {
            return NextResponse.json({
                success: false,
                error: `A configuration with this name already exists for ${subject}`
            }, { status: 409 });
        }

        // Check max limit (5 configs PER SUBJECT)
        const subjectConfigs = userDoc.sprint_configs.filter((c: any) => c.subject === subject);
        if (subjectConfigs.length >= 5) {
            return NextResponse.json({
                success: false,
                error: `Maximum 5 configurations allowed for ${subject}. Please delete one before adding a new one.`
            }, { status: 400 });
        }

        // Add new configuration
        const newConfig = {
            name,
            subject,
            topics,
            difficulty,
            question_count,
            created_at: new Date()
        };

        userDoc.sprint_configs.push(newConfig);
        await userDoc.save();

        return NextResponse.json({ success: true, config: newConfig });
    } catch (error) {
        console.error('Error saving sprint config:', error);
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}

// DELETE /api/sprint/configs?name=<name> - Delete a configuration
export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name');

        if (!name) {
            return NextResponse.json({ success: false, error: 'Configuration name is required' }, { status: 400 });
        }

        const userDoc = await User.findById(user.userId);
        if (!userDoc) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const initialLength = userDoc.sprint_configs.length;
        userDoc.sprint_configs = userDoc.sprint_configs.filter((c: any) => c.name !== name);

        if (userDoc.sprint_configs.length === initialLength) {
            return NextResponse.json({ success: false, error: 'Configuration not found' }, { status: 404 });
        }

        await userDoc.save();

        return NextResponse.json({ success: true, message: 'Configuration deleted successfully' });
    } catch (error) {
        console.error('Error deleting sprint config:', error);
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}

// PATCH /api/sprint/configs - Update last_used timestamp
export async function PATCH(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ success: false, error: 'Configuration name is required' }, { status: 400 });
        }

        const userDoc = await User.findById(user.userId);
        if (!userDoc) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const config = userDoc.sprint_configs.find((c: any) => c.name === name);
        if (!config) {
            return NextResponse.json({ success: false, error: 'Configuration not found' }, { status: 404 });
        }

        config.last_used = new Date();
        await userDoc.save();

        return NextResponse.json({ success: true, message: 'Configuration updated successfully' });
    } catch (error) {
        console.error('Error updating sprint config:', error);
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
