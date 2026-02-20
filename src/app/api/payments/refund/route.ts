import { NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import RefundRequest from '@/core/models/RefundRequest';
import Payment from '@/core/models/Payment';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { reason, custom_reason } = body;

        if (!reason) {
            return NextResponse.json({ error: 'Reason is required' }, { status: 400 });
        }

        await dbConnect();

        // 1. Find the latest successful payment
        const latestPayment = await Payment.findOne({
            user_id: user.userId,
            status: 'SUCCESS'
        }).sort({ created_at: -1 });

        if (!latestPayment) {
            return NextResponse.json({ error: 'No successful payment found to refund.' }, { status: 404 });
        }

        // 2. Check 7-day window
        const paymentDate = new Date(latestPayment.created_at);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        if (paymentDate < sevenDaysAgo) {
            return NextResponse.json({ error: 'Refund period has expired (7 days).' }, { status: 400 });
        }

        // 3. Check if request already exists for this payment
        const existingRequest = await RefundRequest.findOne({
            razorpay_payment_id: latestPayment.razorpay_payment_id
        });

        if (existingRequest) {
            return NextResponse.json({ error: 'Refund request already submitted for this payment.' }, { status: 400 });
        }

        // 4. Create Refund Request
        const newRefund = await RefundRequest.create({
            user_id: user.userId,
            razorpay_payment_id: latestPayment.razorpay_payment_id,
            amount: latestPayment.amount,
            reason,
            custom_reason,
            status: 'PENDING'
        });

        return NextResponse.json({
            success: true,
            message: 'Refund request submitted successfully.',
            data: newRefund
        });

    } catch (error) {
        console.error('Error submitting refund request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
