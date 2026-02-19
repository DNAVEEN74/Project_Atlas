import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { requireAdmin, getCurrentUser } from '@/lib/auth'; // Using auth utils
import dbConnect from '@/core/db/connect';
import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId({ length: 10 });

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { planId } = body;

        let amount = 0;
        let currency = 'INR';

        if (planId === 'monthly') {
            amount = 9900; // ₹99 in paise
        } else if (planId === 'yearly') {
            amount = 49900; // ₹499 in paise
        } else {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        const options = {
            amount: amount,
            currency: currency,
            receipt: `receipt_${uid.rnd()}`,
            notes: {
                userId: user.userId,
                planId: planId,
            },
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID, // Send key ID to frontend
        });

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
    }
}
