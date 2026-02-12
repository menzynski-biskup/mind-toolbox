# Authentication System - Complete Guide

This document provides comprehensive information about setting up, testing, and understanding the authentication system for your Cloudflare Workers + D1 application.

## Overview

The authentication system provides:
- **User Registration**: Create new user accounts with email/password
- **User Login**: Authenticate users with credentials
- **Session Management**: JWT tokens stored in secure HttpOnly cookies (7-day expiration)
- **User Profile**: Get current authenticated user information
- **Logout**: Clear authentication session

### Technology Stack

- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Language**: TypeScript
- **Password Hashing**: PBKDF2 via Web Crypto API
- **Session**: JWT (HS256) in HttpOnly cookies
- **Validation**: Custom validation functions
- **Rate Limiting**: In-memory (per worker instance)

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Cloudflare account
- Wrangler CLI installed

```bash
npm install -g wrangler
wrangler login
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create D1 Database

#### For Production (Remote)

```bash
# Create the database
npx wrangler d1 create mindtoolbox-db

# The output will show your database_id, for example:
# database_id = "e75d8e99-06d8-4da1-8e2f-1e591f91c0b2"
```

Update `wrangler.jsonc` with your database ID:

```json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "mindtoolbox-db",
    "database_id": "YOUR_ACTUAL_DATABASE_ID_HERE"
  }
]
```

#### For Local Development

Wrangler will automatically create a local D1 database when you use `--local` flag.

### 4. Run Database Migration

This creates the `users` table with proper schema.

#### Local (Development)

```bash
npx wrangler d1 execute mindtoolbox-db --local --file=./worker/migrations/0001_create_users_table.sql
```

#### Remote (Production)

```bash
npx wrangler d1 execute mindtoolbox-db --remote --file=./worker/migrations/0001_create_users_table.sql
```

### 5. Set JWT Secret

The JWT secret is used to sign authentication tokens. **Never commit this to version control!**

#### For Local Development

For local testing only, you can use the `vars` section in `wrangler.jsonc`:

```json
"vars": {
  "JWT_SECRET": "local-dev-secret-only-NOT-FOR-PRODUCTION"
}
```

**⚠️ Important**: Remove this before deploying to production!

#### For Production

Always use Cloudflare secrets for production:

```bash
# Generate a secure random secret
echo "$(openssl rand -base64 32)" | npx wrangler secret put JWT_SECRET

# Or on Windows:
# 1. Generate: openssl rand -base64 32
# 2. Copy the output
# 3. Run: npx wrangler secret put JWT_SECRET
# 4. Paste the value when prompted
```

### 6. Update CORS Configuration

Edit `worker/src/index.ts` and update the `allowedOrigins` array with your frontend domain(s):

```typescript
const allowedOrigins = [
  'http://localhost:4200',  // Local development
  'https://yourdomain.com'   // Production
];
```

### 7. Start Development Server

```bash
npx wrangler dev --local
```

The worker will be available at `http://localhost:8787`.

### 8. Deploy to Production

```bash
npx wrangler deploy
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,              -- UUID v4
  email TEXT NOT NULL UNIQUE,       -- Lowercase, trimmed
  password_hash TEXT NOT NULL,      -- PBKDF2 hash
  full_name TEXT,                   -- Optional
  role TEXT NOT NULL DEFAULT 'researcher' CHECK(role IN ('clinician', 'researcher', 'admin')),
  created_at TEXT NOT NULL          -- ISO 8601 timestamp
);

CREATE INDEX idx_users_email ON users(email);
```

## Testing the Authentication System

### Manual Testing with curl

#### 1. Register a New User

```bash
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "full_name": "Test User",
    "role": "researcher"
  }' \
  -c cookies.txt \
  -v
```

**Expected Response (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "full_name": "Test User",
    "role": "researcher",
    "created_at": "2026-02-12T13:00:00.000Z"
  }
}
```

**Cookie Set:**
```
Set-Cookie: mind_session=<jwt_token>; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
```

#### 2. Try to Register with Same Email

```bash
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "AnotherPass456",
    "full_name": "Another User"
  }'
```

**Expected Response (400):**
```json
{
  "error": "Registration failed. Please try again."
}
```

**Note**: The error message is intentionally generic to prevent email enumeration.

#### 3. Login with Correct Password

```bash
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }' \
  -c cookies.txt \
  -v
```

**Expected Response (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "full_name": "Test User",
    "role": "researcher",
    "created_at": "2026-02-12T13:00:00.000Z"
  }
}
```

#### 4. Login with Wrong Password

```bash
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword"
  }'
```

**Expected Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

#### 5. Get Current User (with cookie)

```bash
curl -X GET http://localhost:8787/api/me \
  -b cookies.txt \
  -v
```

**Expected Response (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "full_name": "Test User",
    "role": "researcher",
    "created_at": "2026-02-12T13:00:00.000Z"
  }
}
```

#### 6. Get Current User (without cookie)

```bash
curl -X GET http://localhost:8787/api/me
```

**Expected Response (401):**
```json
{
  "error": "Not authenticated"
}
```

#### 7. Logout

```bash
curl -X POST http://localhost:8787/api/auth/logout \
  -b cookies.txt \
  -c cookies.txt \
  -v
```

**Expected Response (200):**
```json
{
  "ok": true
}
```

**Cookie Cleared:**
```
Set-Cookie: mind_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0
```

#### 8. Try to Access Protected Route After Logout

```bash
curl -X GET http://localhost:8787/api/me \
  -b cookies.txt
```

**Expected Response (401):**
```json
{
  "error": "Not authenticated"
}
```

### Rate Limiting Test

Try to login or register more than 5 times within 15 minutes:

```bash
for i in {1..6}; do
  echo "Attempt $i"
  curl -X POST http://localhost:8787/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}' \
    -v
  echo "\n"
done
```

**Expected Response (429) on 6th attempt:**
```json
{
  "error": "Too many requests. Please try again later."
}
```

**Headers:**
```
Retry-After: 900
```

## Security Features

### 1. Password Security

- **Algorithm**: PBKDF2 with SHA-256
- **Iterations**: 100,000
- **Salt**: 16 bytes random
- **Key Length**: 32 bytes
- **Storage**: Base64-encoded (salt + hash)

### 2. JWT Token Security

- **Algorithm**: HS256 (HMAC SHA-256)
- **Payload**: `{ sub: userId, email, role, iat, exp }`
- **Expiration**: 7 days
- **Storage**: HttpOnly cookie (not accessible via JavaScript)

### 3. Cookie Security

- **Name**: `mind_session`
- **HttpOnly**: Yes (prevents XSS attacks)
- **Secure**: Yes (HTTPS only in production)
- **SameSite**: Lax (prevents CSRF attacks)
- **Path**: /
- **Max-Age**: 604800 seconds (7 days)

### 4. Input Validation

- **Email**: RFC 5322 compliant, lowercase, trimmed, max 255 chars
- **Password**: Min 8 chars, max 128 chars, must contain at least one letter and one number
- **Full Name**: Min 2 chars, max 100 chars, letters/spaces/hyphens/apostrophes only
- **Role**: Must be one of: `clinician`, `researcher`, `admin`

### 5. Rate Limiting

- **Window**: 15 minutes
- **Limit**: 5 attempts per window
- **Scope**: Per IP address (CF-Connecting-IP header)
- **Type**: In-memory token bucket (per worker instance)

**Note**: Current rate limiting is best-effort and per-worker instance. For production, consider upgrading to KV or Durable Objects for distributed rate limiting.

### 6. Security Best Practices

- ✅ No email enumeration (generic error messages)
- ✅ Constant-time password comparison
- ✅ Timing attack mitigation (hash password even when user doesn't exist)
- ✅ No sensitive data in error messages
- ✅ No stack traces exposed to clients
- ✅ CORS properly configured
- ✅ Secure password requirements
- ✅ HttpOnly cookies prevent XSS
- ✅ SameSite cookies prevent CSRF

## API Reference

### POST /api/auth/register

Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "full_name": "John Doe",  // optional
  "role": "researcher"       // optional, defaults to "researcher"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "researcher",
    "created_at": "2026-02-12T13:00:00.000Z"
  }
}
```

### POST /api/auth/login

Authenticate with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "researcher",
    "created_at": "2026-02-12T13:00:00.000Z"
  }
}
```

### GET /api/me

Get current authenticated user. Requires valid session cookie.

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "researcher",
    "created_at": "2026-02-12T13:00:00.000Z"
  }
}
```

### POST /api/auth/logout

Clear authentication session.

**Response (200):**
```json
{
  "ok": true
}
```

## Troubleshooting

### Database Not Found

**Error**: "Authentication service not configured"

**Solution**:
1. Verify D1 database is created
2. Check database_id in `wrangler.jsonc`
3. Run migration to create tables
4. Restart dev server

### JWT Secret Not Set

**Error**: JWT verification fails or tokens can't be signed

**Solution**:
- Local: Set `JWT_SECRET` in `vars` section of `wrangler.jsonc`
- Production: Run `npx wrangler secret put JWT_SECRET`

### CORS Errors

**Error**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**:
1. Add your frontend origin to `allowedOrigins` in `worker/src/index.ts`
2. Ensure requests include `credentials: 'include'` (fetch) or `withCredentials: true` (Angular)

### Cookies Not Set

**Issue**: Cookies aren't being saved in the browser

**Solution**:
1. Check that you're using `credentials: 'include'` in fetch requests
2. In production, ensure you're using HTTPS
3. Verify CORS is properly configured
4. Check that frontend and backend domains match expectations

### Rate Limit Too Strict

**Issue**: Getting rate limited during development

**Solution**:
- Increase `MAX_ATTEMPTS` in `worker/src/utils/rate-limit.ts`
- Increase `RATE_LIMIT_WINDOW` for longer window
- Or clear cookies and restart browser to reset rate limiting

## Future Enhancements

These features are not currently implemented but are recommended for production:

### 1. Refresh Tokens
- Implement short-lived access tokens (15 min) with long-lived refresh tokens (30 days)
- Store refresh tokens in database
- Add rotation mechanism

### 2. Email Verification
- Send verification email on registration
- Require email verification before full access
- Add email verification status to user table

### 3. Password Reset
- "Forgot password" flow with email token
- Time-limited reset tokens
- Store reset tokens securely

### 4. Persistent Rate Limiting
- Migrate from in-memory to Cloudflare KV or Durable Objects
- Distributed rate limiting across all worker instances
- More sophisticated algorithms (sliding window)

### 5. Multi-Factor Authentication (MFA)
- TOTP support (Google Authenticator, etc.)
- Backup codes
- SMS verification (optional)

### 6. Session Management
- View active sessions
- Remote logout from all devices
- Device tracking

### 7. Audit Logging
- Track login attempts, failures, and successes
- IP address logging
- Suspicious activity detection

### 8. Account Security
- Password strength meter
- Compromised password detection (HaveIBeenPwned API)
- Mandatory password rotation
- Account lockout after failed attempts

## Support

For issues or questions:
1. Check this documentation
2. Review `AUTH_USAGE.md` for frontend examples
3. Check worker logs: `npx wrangler tail`
4. Review D1 data: `npx wrangler d1 execute mindtoolbox-db --local --command "SELECT * FROM users"`

## License

See main project LICENSE file.
