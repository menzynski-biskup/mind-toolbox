// Environment bindings for Cloudflare Worker
export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}
