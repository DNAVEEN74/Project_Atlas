Here's a complete plan for implementing **Forgot Password** — including how to handle email without a dedicated app email yet.

---

## Forgot Password Implementation

### The Flow

```
User clicks "Forgot Password"
  → Enters email → API creates reset token → Sends email
  → User clicks link → Enters new password → Done
```

### Step 1: Add Reset Token Fields to User Model

In your `User.ts` schema, add:

```typescript
password_reset_token?: string;        // hashed token stored in DB
password_reset_expires?: Date;        // expiry (15-30 mins)
```

### Step 2: API Routes to Create

**POST `/api/auth/forgot-password`**
- Accept email
- Generate a random token: `crypto.randomBytes(32).toString('hex')`
- Hash it with `crypto.createHash('sha256')` before storing in DB (store hash, send raw)
- Set expiry to `Date.now() + 15 * 60 * 1000` (15 mins)
- Send reset email with link: `https://yourapp.com/reset-password?token=RAW_TOKEN`

**POST `/api/auth/reset-password`**
- Accept `token` + `newPassword`
- Hash the incoming token and find user where hash matches AND expiry > now
- Update `password_hash` with bcrypt, clear the reset token fields
- Done

### Step 3: The Email Problem — Solved for Free

You have great free options **right now** without a custom domain email:

**Option A: Gmail (Easiest for now)**
Use your personal Gmail with an App Password:
1. Enable 2FA on Gmail
2. Go to Google Account → Security → App Passwords → Generate one
3. Use `nodemailer` with SMTP

```typescript
// In your .env
EMAIL_USER=yourname@gmail.com
EMAIL_PASS=your-app-password-16-chars
```

**Option B: Resend.com (Best for Production)**
- Free tier: 3,000 emails/month, 100/day — perfect for your launch scale
- You can send FROM `onboarding@resend.dev` for free **without owning a domain**
- When you get your domain later, just add it in their dashboard
- Clean API, no SMTP config needed

```bash
npm install resend
```

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'PrepLeague <onboarding@resend.dev>',  // free sender until you have domain
  to: user.email,
  subject: 'Reset your PrepLeague password',
  html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 15 minutes.</p>`
});
```

**My recommendation: Start with Resend.** Sign up at resend.com, get API key in 2 minutes, works immediately with their `@resend.dev` domain. When you get `prepeleague.com` or similar, you just verify the domain and update the `from` address — zero other changes needed.

### Step 4: Frontend Pages Needed

- `/forgot-password` — simple email input form
- `/reset-password` — new password + confirm form (reads `?token=` from URL)

### Step 5: Security Checklist

- Always return the same response whether email exists or not ("If this email is registered, you'll receive a link") — prevents email enumeration
- Token expires in 15–30 minutes
- Token is single-use (clear it after successful reset)
- Hash the token before storing (raw token only travels via email)

---

**Implementation order:** User model changes → API routes → Resend setup → Frontend pages. The whole thing is maybe 3–4 hours of work. Want me to write out the actual code for any of these pieces?