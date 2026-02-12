# Frontend Integration Guide

This guide shows how to integrate the authentication API with your frontend application.

## Angular Integration

### 1. Auth Service

The `AuthService` is already created in `src/app/services/auth.service.ts`. It provides:

- `register(email, password, fullName, role)` - Register a new user
- `login(email, password)` - Login user
- `logout()` - Logout user
- `checkAuthState()` - Check if user is authenticated
- `currentUser` - Signal with current user data
- `loading` - Signal with loading state

### 2. Auth Guard

The `authGuard` in `src/app/services/auth.guard.ts` protects routes that require authentication.

**Usage in routes:**

```typescript
// app.routes.ts
import { authGuard, roleGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard], // Requires authentication
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'researcher',
    canActivate: [roleGuard(['researcher', 'admin'])], // Requires researcher or admin role
    loadComponent: () => import('./pages/researcher-dashboard/researcher-dashboard').then(m => m.ResearcherDashboardComponent)
  }
];
```

### 3. Using Auth Service in Components

```typescript
// Example: Login component
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-form">
      <h2>Login</h2>
      
      @if (errorMessage()) {
        <div class="error">{{ errorMessage() }}</div>
      }
      
      <form (ngSubmit)="onLogin()">
        <input 
          type="email" 
          [(ngModel)]="email" 
          placeholder="Email"
          required
        />
        
        <input 
          type="password" 
          [(ngModel)]="password" 
          placeholder="Password"
          required
        />
        
        <button type="submit" [disabled]="authService.loading()">
          @if (authService.loading()) {
            Logging in...
          } @else {
            Login
          }
        </button>
      </form>
    </div>
  `
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  
  email = '';
  password = '';
  errorMessage = signal<string>('');

  async onLogin() {
    const result = await this.authService.login(this.email, this.password);
    
    if (result.success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage.set(result.error || 'Login failed');
    }
  }
}
```

## Vanilla JavaScript / Fetch API Examples

### Register User

```javascript
async function register(email, password, fullName, role = 'researcher') {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, full_name: fullName, role }),
  });
  return response.ok ? await response.json() : null;
}
```

### Login User

```javascript
async function login(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.ok ? await response.json() : null;
}
```

### Get Current User

```javascript
async function getCurrentUser() {
  const response = await fetch('/api/me', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.ok ? await response.json() : null;
}
```

### Logout User

```javascript
async function logout() {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  window.location.href = '/login';
}
```

### Route Guard Logic

```javascript
async function checkAuthBeforeLoad() {
  const data = await getCurrentUser();
  if (!data) {
    window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
    return false;
  }
  return true;
}
```

## Important Notes

1. **Always use `credentials: 'include'`** in fetch requests
2. **HTTPS required** for secure cookies in production
3. **Rate limiting**: 5 attempts per 15 minutes for login/register
4. **Password requirements**: Min 8 chars, includes letter and number
5. **Error handling**: Handle both network and API errors
