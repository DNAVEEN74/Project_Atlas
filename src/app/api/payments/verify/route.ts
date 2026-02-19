import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/core/db/connect';
import User from '@/core/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = body;

        const bodyData = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(bodyData.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            await dbConnect();

            const startDate = new Date();
            let endDate = new Date();

            if (planId === 'monthly') {
                endDate.setMonth(endDate.getMonth() + 1);
            } else if (planId === 'yearly') {
                endDate.setFullYear(endDate.getFullYear() + 1);
            }

            await User.findByIdAndUpdate(user.userId, {
                $set: {
                    'config.is_premium': true,
                    'subscription': {
                        plan: planId.toUpperCase(),
                        status: 'ACTIVE',
                        start_date: startDate,
                        end_date: endDate,
                    }
                },
                $push: {
                    payment_history: {
                        order_id: razorpay_order_id,
                        payment_id: razorpay_payment_id,
                        amount: planId === 'monthly' ? 99 : 499,
                        status: 'SUCCESS',
                        date: new Date(),
                    }
                }
            });

            return NextResponse.json({ message: 'Payment success', success: true });
        } else {
            return NextResponse.json({ message: 'Payment verification failed', success: false }, { status: 400 });
        }

    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
