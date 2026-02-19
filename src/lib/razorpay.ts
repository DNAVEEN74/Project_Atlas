import Razorpay from 'razorpay';

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
    console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not defined. Razorpay functionality will not work.');
}

// Export a safe instance even if keys are missing (for build time)
// API calls will fail at runtime if keys are invalid, which is expected.
export const razorpay = new Razorpay({
    key_id: key_id || 'rzp_test_dummy',
    key_secret: key_secret || 'dummy_secret',
});
