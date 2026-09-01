import { config as start } from 'dotenv'

start()

// The server no longer holds a MangaDex account of its own — each request is
// authenticated with the caller's forwarded access token (see src/index.ts).
// Only the upstream base URLs remain.
export const config = {
  BASE_URL: process.env.BASE_URL,
  UPLOAD_BASE_URL: process.env.UPLOAD_BASE_URL
}
