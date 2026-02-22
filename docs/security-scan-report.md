# Security Scan Report — Project Atlas

**Date:** 2026-02-22
**Branch:** `claude/security-scan-h9Wul`
**Scope:** Full codebase static analysis + dependency audit

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 2 |
| High     | 5 |
| Medium   | 3 |
| Low      | 2 |

---

## Critical

### C1 — Unauthenticated File Upload Endpoint
**File:** `src/app/api/upload/route.ts`
**Risk:** Any unauthenticated user can upload arbitrary files to the R2 storage bucket. There is no `getCurrentUser()` call or auth check, no file type validation, and no rate limiting applied to this route.
**Impact:** Storage abuse, potential hosting of malicious content, cost amplification attacks.
**Fix:** Add `getCurrentUser()` authentication guard. Validate `file.type` against an allowlist (e.g., `image/png`, `image/jpeg`, `image/webp`). Enforce a file size cap. This endpoint should require admin authentication given it's used for question images.

---

### C2 — Critical Dependency Vulnerability: `fast-xml-parser`
**File:** `package.json` (transitive via `@aws-sdk/xml-builder`)
**Advisory:** Three CVEs:
- `GHSA-37qj-frw5-hhjh` — RangeError DoS via numeric entities
- `GHSA-jmr7-xgp7-cmfj` — DoS via entity expansion in DOCTYPE
- `GHSA-m7jm-9gc2-mpf2` — Entity encoding bypass via regex injection in DOCTYPE entity names

**Impact:** Denial-of-Service against any endpoint using the AWS S3 client (avatar upload, question image upload).
**Fix:** Run `npm audit fix` to update `@aws-sdk/client-s3` and its chain to a patched version. Alternatively, pin `fast-xml-parser` to `>=5.3.6`.

---

## High

### H1 — Hardcoded Fallback JWT Secret
**File:** `src/lib/auth.ts:6`
```ts
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
```
**Risk:** If `JWT_SECRET` is not set in the environment, all JWTs are signed with a well-known hardcoded string. Any attacker can forge valid session tokens.
**Fix:** Remove the fallback. Throw a startup error if `JWT_SECRET` is absent:
```ts
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set');
```

---

### H2 — XSS Risk: Unsanitized Question Text Rendered as HTML
**File:** `src/app/sprint/[id]/review/page.tsx:485`
```tsx
dangerouslySetInnerHTML={{ __html: q.title || 'Question content not available' }}
```
**Context:** `q.title` is sourced directly from `q.text` in the DB (set at `src/app/sprint/[id]/review/page.tsx:109`). Question text comes from admin-imported JSON/DB content. If a question text ever contains `<script>` tags or event handler attributes, it will execute in every reviewing user's browser.
**Fix:** Either use the existing `<MathText>` component (which already handles rendering safely via KaTeX), or sanitize the HTML using `DOMPurify` before injection. The `MathText` component is the correct solution as it's already used elsewhere in the app.

---

### H3 — Uncontrolled `$regex` Query Enables ReDoS
**File:** `src/app/api/questions/route.ts:83`
```ts
filter.text = { $regex: query, $options: "i" };
```
**Risk:** The `query` parameter is passed directly from user input into a MongoDB `$regex` filter without sanitization or length limits. A crafted regex pattern (e.g., `(a+)+$`) can cause catastrophic backtracking, hanging the DB or causing a Denial of Service.
**File 2:** `src/app/api/questions/[id]/navigation/route.ts:63` (same pattern)
**Fix:** Escape regex special characters before use: `query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`. Also enforce a maximum query length (e.g., 100 chars).

---

### H4 — In-Memory Rate Limiter Bypassed in Multi-Instance Deployments
**File:** `src/middleware.ts:5-26`
**Risk:** The rate limiter uses a `Map` stored in Node.js process memory. In serverless (Vercel) or multi-instance deployments each instance has its own independent counter. An attacker can bypass rate limits by distributing requests across instances. This particularly affects `/api/auth` routes (login brute force, OTP enumeration).
**Fix:** Replace with a distributed rate limiter backed by Redis or Upstash. For Vercel, `@upstash/ratelimit` with `@upstash/redis` is the idiomatic solution.

---

### H5 — IP Spoofing in Rate Limiter via `x-forwarded-for`
**File:** `src/middleware.ts:32`
```ts
const ip = request.headers.get('x-forwarded-for') || 'unknown';
```
**Risk:** `x-forwarded-for` is a user-controlled header. An attacker can set it to arbitrary values to bypass per-IP rate limits.
**Fix:** Trust only the first IP in the chain (which is set by the CDN/proxy) and ensure the application sits behind a trusted reverse proxy. On Vercel, use `request.ip` or the `x-real-ip` header injected by Vercel's edge layer, which cannot be spoofed by clients.

---

## Medium

### M1 — Weak Password Minimum Length (6 characters)
**Files:** `src/app/api/auth/register/route.ts:29`, `src/app/api/auth/reset-password/route.ts:15`, `src/app/api/auth/change-password/route.ts:20`
**Risk:** 6-character passwords are easily brute-forced. NIST SP 800-63B recommends a minimum of 8 characters; best practice is 12.
**Fix:** Raise the minimum to 8 characters across all auth endpoints and update corresponding frontend validation.

---

### M2 — `bcrypt` Salt Rounds Inconsistency
**Files:** `src/lib/auth.ts:19` uses `saltRounds = 12`, but `src/app/api/auth/reset-password/route.ts:34` uses `bcrypt.genSalt(10)` and `src/app/api/auth/change-password/route.ts:40` also uses `10`.
**Risk:** Minor inconsistency — passwords reset or changed via these routes get weaker hashing (10 rounds vs 12). While the difference is small, centralized configuration is better practice.
**Fix:** Consolidate all `bcrypt` hashing through the `hashPassword()` function in `src/lib/auth.ts` so the salt rounds setting is in one place.

---

### M3 — Missing Security Headers
**File:** `next.config.ts`
**Risk:** The Next.js config does not set HTTP security headers. The application is missing:
- `Content-Security-Policy` — mitigates XSS (critical given the `dangerouslySetInnerHTML` usage)
- `X-Frame-Options` / `frame-ancestors` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `Referrer-Policy` — prevents leaking sensitive URL parameters (e.g., password reset tokens in the URL)
- `Strict-Transport-Security` — enforces HTTPS

**Fix:** Add `headers()` to `next.config.ts`:
```ts
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    ],
  }];
}
```
A strict CSP should be added once the inline script/style usage is audited.

---

## Low

### L1 — Password Reset Token Exposed in URL
**File:** `src/app/api/auth/forgot-password/route.ts:32`
```ts
const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${rawToken}`;
```
**Risk:** The reset token appears in the URL query string. This can leak via browser history, `Referer` headers to third-party scripts, and server access logs. The missing `Referrer-Policy` header (see M3) amplifies this risk.
**Fix:** Pass the token as a URL fragment (`#token=...`) which is never sent to servers, or implement a POST-based reset flow. At minimum, add `Referrer-Policy: no-referrer` as a security header.

---

### L2 — Exam Interest Form Accepts Arbitrary Input Without Sanitization
**File:** `src/app/api/exam-request/route.ts`
**Risk:** The `email`, `examName`, and `fullName` fields are stored in MongoDB without input length limits or format validation. This could allow storage of very long strings (storage abuse) or content that could be problematic if later displayed to admins in a UI without escaping.
**Fix:** Add length caps (`examName.length <= 100`, `fullName.length <= 100`) and validate email format with a basic regex or library like `zod` (already a project dependency).

---

## Dependency Audit Summary (npm audit)

| Severity | Count | Root Cause |
|----------|-------|------------|
| Critical | 1 | `fast-xml-parser` (via `@aws-sdk`) |
| High | 34 | `@aws-sdk/*` chain + `minimatch` in ESLint tooling |
| Moderate | 1 | `ajv` ReDoS |

**Action:** Run `npm audit fix` to resolve automatically fixable issues. The `minimatch` and ESLint-related highs are dev-only dependencies and pose no runtime risk; they can be addressed in a separate PR.

---

## Positive Findings

The following security practices are correctly implemented:

- **Password hashing:** bcrypt used with adequate salt rounds (12) in the primary auth path.
- **JWT verification:** `jsonwebtoken.verify()` used properly; tokens verified on every request via `getCurrentUser()`.
- **Anti-enumeration:** Forgot-password endpoint always returns success regardless of whether the email exists.
- **Single-use tokens:** OTP and password reset tokens are deleted/cleared after successful use.
- **Token hashing:** Reset tokens and OTPs are stored as SHA-256 hashes in the DB, not plaintext.
- **HttpOnly cookies:** Auth cookie is set `httpOnly: true`, preventing JS access.
- **Admin authorization:** All `/api/admin/*` routes correctly call `requireAdmin()`.
- **Mongoose ObjectId validation:** `GET /api/questions/[id]` validates ObjectId format before querying.
- **Correct HMAC verification:** Razorpay payment signature verified server-side via HMAC-SHA256.
- **Payment auth check:** Payment verification requires an authenticated session before processing.
- **`.gitignore`:** `.env*` files correctly excluded from version control.

---

## Recommended Priority Order

1. **C1** — Add auth to `/api/upload`
2. **C2** — `npm audit fix` for `fast-xml-parser`
3. **H1** — Remove hardcoded JWT secret fallback
4. **H2** — Replace raw HTML injection with `<MathText>` in sprint review
5. **H3** — Sanitize/escape `$regex` query input
6. **M3** — Add security headers to `next.config.ts`
7. **H4/H5** — Migrate to distributed rate limiter
8. **M1** — Raise minimum password length to 8
9. **M2** — Centralize bcrypt salt rounds
10. **L1/L2** — Token URL leakage + input validation
