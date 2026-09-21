# Luma Finance frontend

React + Vite starter for the loan management system.

## Start locally

1. Copy `.env.example` to `.env` and adjust service URLs if necessary.
2. Run `npm install`.
3. Run `npm run dev`.

## Backend integration

All backend communication lives in `src/api/client.js`. Update only the paths there when the final controller routes differ. The client reads base URLs from `.env`, sends JSON by default, and attaches a stored bearer token when `luma_token` is present.
