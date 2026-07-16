import { copyFile, mkdir, writeFile } from 'node:fs/promises';

await mkdir('dist/server', { recursive: true });
await mkdir('dist/.openai', { recursive: true });
await copyFile('.openai/hosting.json', 'dist/.openai/hosting.json');

await writeFile(
  'dist/server/index.js',
  `export default {
  async fetch(request, env) {
    if (!env.ASSETS || typeof env.ASSETS.fetch !== 'function') {
      return new Response('Static assets binding is unavailable', { status: 503 });
    }
    const url = new URL(request.url);
    if (url.pathname === '/' || !url.pathname.includes('.')) {
      url.pathname = '/index.html';
      return env.ASSETS.fetch(new Request(url, request));
    }
    return env.ASSETS.fetch(request);
  },
};
`,
  'utf8',
);
