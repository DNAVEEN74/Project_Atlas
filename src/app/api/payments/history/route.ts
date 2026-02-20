import { NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import Payment from '@/core/models/Payment';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const payments = await Payment.find({ user_id: authUser.userId })
            .sort({ created_at: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            payments: payments.map(p => ({
                id: (p as any)._id,
                amount: p.amount,
                currency: p.currency,
                status: p.status,
                plan_id: p.plan_id,
                date: p.created_at,
                order_id: p.razorpay_order_id
            }))
        });

    } catch (error) {
        console.error('Payment history error:', error);
        return NextResponse.json({ error: 'Failed to fetch payment history' }, { status: 500 });
    }
}
