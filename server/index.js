import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getInstagramCache,
  INSTAGRAM_POLL_INTERVAL_MS,
  refreshInstagramCache,
  startInstagramPolling,
} from './instagram.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distPath = path.join(projectRoot, 'dist');

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(
  cors({
    origin: true,
  }),
);

app.get('/api/instagram', async (_request, response) => {
  const snapshot = getInstagramCache();

  if (!snapshot.last_fetched_at) {
    try {
      await refreshInstagramCache('first-request');
    } catch (error) {
      return response.status(503).json({
        ok: false,
        ...getInstagramCache(),
        error: error.message,
      });
    }
  } else if (
    Date.now() - Date.parse(snapshot.last_fetched_at) > INSTAGRAM_POLL_INTERVAL_MS &&
    snapshot.posts.length > 0
  ) {
    refreshInstagramCache('stale-request').catch((error) => {
      console.warn(`[instagram] Background refresh failed: ${error.message}`);
    });
  }

  const payload = getInstagramCache();

  response.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
  response.json({
    ok: payload.posts.length > 0,
    ...payload,
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath));

  app.get('*', (_request, response) => {
    response.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, () => {
  startInstagramPolling();
  console.info(`[server] Instagram proxy listening on http://localhost:${port}`);
});
