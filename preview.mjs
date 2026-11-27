import { createServer } from 'node:http';
import { localDatabase } from './local-db.mjs';
import worker from './dist/server/index.js';

const port = Number(process.env.PORTFOLIO_PREVIEW_PORT || 4176);
const previewOwner = 'preview-owner@example.test';
const env = { DB: localDatabase(), PORTFOLIO_OWNER_EMAIL: previewOwner };

createServer(async (incoming, outgoing) => {
  try {
    const url = new URL(incoming.url, `http://127.0.0.1:${port}`);
    const headers = new Headers(incoming.headers);
    headers.delete('oai-authenticated-user-id');
    headers.delete('oai-authenticated-user-email');
    if (url.pathname === '/signin-with-chatgpt') {
      const returnTo = url.searchParams.get('return_to');
      const target = returnTo?.startsWith('/studio/') ? returnTo : '/studio/';
      outgoing.writeHead(302, { 'set-cookie': 'portfolio_local_preview=1; Path=/; HttpOnly; SameSite=Strict', location: target });
      outgoing.end();
      return;
    }
    if (/(^|;\s*)portfolio_local_preview=1(;|$)/.test(headers.get('cookie') || '')) {
      headers.set('oai-authenticated-user-id', 'local-preview');
      headers.set('oai-authenticated-user-email', previewOwner);
    }
    const chunks = [];
    for await (const chunk of incoming) chunks.push(chunk);
    const body = chunks.length ? Buffer.concat(chunks) : undefined;
    const response = await worker.fetch(new Request(url, { method: incoming.method, headers, body }), env);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    outgoing.writeHead(500);
    outgoing.end(String(error));
  }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}/`));
