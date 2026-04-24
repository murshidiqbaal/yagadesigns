# YAGA Designs

Luxury bridal design studio website built with React, Vite, Tailwind, and a cache-backed Express proxy for the Instagram showcase.

## Folder structure

```text
src/
  components/
    instagram/
      InstagramMediaCard.tsx
      InstagramShowcaseSection.tsx
  lib/
    instagram.ts
server/
  index.js
  instagram.service.js
```

## Run locally

1. Copy `.env.example` to `.env` and fill in any Appwrite values you use.
2. Start the backend proxy:

```bash
npm run server:dev
```

3. In a second terminal, start the Vite frontend:

```bash
npm run dev
```

4. Open the frontend at `http://localhost:8080`.

The frontend reads Instagram data from `/api/instagram` through the Vite proxy in development. In production, point `VITE_API_BASE_URL` at your deployed Node server if the site and API are not served from the same origin.

## Instagram proxy notes

- The backend polls Instagram every hour and stores the latest response in memory.
- It attempts the legacy public JSON URL first, then falls back to Instagram's current public web-profile payload if needed.
- New posts are detected by comparing the most recent cached post ID against the freshly fetched one.
- The frontend never talks to Instagram directly.
