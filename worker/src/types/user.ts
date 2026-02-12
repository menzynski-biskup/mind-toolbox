// User types
export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'clinician' | 'researcher' | 'admin';
  created_at: string;
}

export interface SafeUser {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export interface JWTPayload {
  userId: number;
  role: string;
  iat: number;
  exp: number;
}
