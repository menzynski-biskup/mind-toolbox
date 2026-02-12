# Authentication API Usage Guide

This document provides examples for using the authentication API from your frontend application.

## Important Note

All requests **must** include `credentials: "include"` to ensure cookies are sent and received properly.

## Base URL

For local development:
```
http://localhost:8787
```

For production:
```
https://your-worker-domain.workers.dev
```

## API Endpoints

### 1. Register a New User

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "full_name": "John Doe",
  "role": "researcher"
}
```

**Fields:**
- `email` (required): User's email address
- `password` (required): Must be at least 8 characters, contain at least one number and one letter
- `full_name` (optional): User's full name
- `role` (optional): One of `clinician`, `researcher`, or `admin` (defaults to `researcher`)

**Example:**
```javascript
async function register() {
  try {
    const response = await fetch('http://localhost:8787/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important!
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'SecurePass123',
        full_name: 'John Doe',
        role: 'researcher'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Registration failed:', error.error);
      return;
    }

    const data = await response.json();
    console.log('Registered user:', data.user);
    // Cookie is automatically set by the browser
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "researcher",
    "created_at": "2026-02-12T13:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Registration failed. Please try again."
}
```

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Example:**
```javascript
async function login() {
  try {
    const response = await fetch('http://localhost:8787/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important!
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'SecurePass123'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Login failed:', error.error);
      return;
    }

    const data = await response.json();
    console.log('Logged in user:', data.user);
    // Cookie is automatically set by the browser
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "researcher",
    "created_at": "2026-02-12T13:00:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

**Rate Limit Response (429):**
```json
{
  "error": "Too many requests. Please try again later."
}
```

---

### 3. Get Current User (Me)

**Endpoint:** `GET /api/me`

**Example:**
```javascript
async function getCurrentUser() {
  try {
    const response = await fetch('http://localhost:8787/api/me', {
      method: 'GET',
      credentials: 'include', // Important!
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Not authenticated:', error.error);
      return;
    }

    const data = await response.json();
    console.log('Current user:', data.user);
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "researcher",
    "created_at": "2026-02-12T13:00:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Not authenticated"
}
```

---

### 4. Logout

**Endpoint:** `POST /api/auth/logout`

**Example:**
```javascript
async function logout() {
  try {
    const response = await fetch('http://localhost:8787/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // Important!
    });

    if (!response.ok) {
      console.error('Logout failed');
      return;
    }

    const data = await response.json();
    console.log('Logged out:', data.ok);
    // Cookie is automatically cleared by the browser
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

**Success Response (200):**
```json
{
  "ok": true
}
```

---

## Complete Authentication Flow Example

Here's a complete example showing the typical authentication flow:

```javascript
class AuthService {
  constructor(baseUrl = 'http://localhost:8787') {
    this.baseUrl = baseUrl;
  }

  async register(email, password, fullName, role = 'researcher') {
    const response = await fetch(`${this.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, full_name: fullName, role })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return await response.json();
  }

  async login(email, password) {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return await response.json();
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseUrl}/api/me`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return await response.json();
  }

  async logout() {
    const response = await fetch(`${this.baseUrl}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return await response.json();
  }
}

// Usage example
async function main() {
  const auth = new AuthService();

  try {
    // Register a new user
    console.log('Registering...');
    const registerResult = await auth.register(
      'test@example.com',
      'SecurePass123',
      'Test User',
      'researcher'
    );
    console.log('Registered:', registerResult.user);

    // Get current user
    console.log('Getting current user...');
    const meResult = await auth.getCurrentUser();
    console.log('Current user:', meResult.user);

    // Logout
    console.log('Logging out...');
    await auth.logout();
    console.log('Logged out successfully');

    // Try to get current user after logout (should fail)
    try {
      await auth.getCurrentUser();
    } catch (error) {
      console.log('Expected error after logout:', error.message);
    }

    // Login with existing credentials
    console.log('Logging in...');
    const loginResult = await auth.login('test@example.com', 'SecurePass123');
    console.log('Logged in:', loginResult.user);

  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Angular Example

For Angular applications, here's a service example:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

interface AuthResponse {
  user: User;
}

interface LogoutResponse {
  ok: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8787';

  constructor(private http: HttpClient) {}

  register(email: string, password: string, fullName: string, role: string = 'researcher'): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/auth/register`, {
      email,
      password,
      full_name: fullName,
      role
    }, { withCredentials: true });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/auth/login`, {
      email,
      password
    }, { withCredentials: true });
  }

  getCurrentUser(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseUrl}/api/me`, {
      withCredentials: true
    });
  }

  logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${this.baseUrl}/api/auth/logout`, {}, {
      withCredentials: true
    });
  }
}
```

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message here"
}
```

Common status codes:
- `200`: Success
- `400`: Bad request (validation error or registration failed)
- `401`: Unauthorized (invalid credentials or not authenticated)
- `429`: Too many requests (rate limited)
- `500`: Internal server error

## Security Notes

1. **Always use HTTPS in production** - The `Secure` flag on cookies requires HTTPS
2. **Credentials must be included** - Use `credentials: 'include'` (fetch) or `withCredentials: true` (Angular)
3. **CORS configuration** - Ensure your frontend origin is in the `allowedOrigins` list in the Worker
4. **Cookie security** - Cookies are HttpOnly, Secure, and SameSite=Lax for security
5. **Rate limiting** - Login and register endpoints are rate-limited (5 attempts per 15 minutes)

## Testing with curl

```bash
# Register
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123","full_name":"Test User"}' \
  -c cookies.txt \
  -v

# Login
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}' \
  -c cookies.txt \
  -v

# Get current user
curl -X GET http://localhost:8787/api/me \
  -b cookies.txt \
  -v

# Logout
curl -X POST http://localhost:8787/api/auth/logout \
  -b cookies.txt \
  -c cookies.txt \
  -v
```
