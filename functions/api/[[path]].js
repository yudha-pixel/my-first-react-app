const API_BASE = 'https://api.trakt.tv';
const IMAGE_BASE = 'https://walter.trakt.tv';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.replace('/api/', '');

  let targetUrl;

  if (path.startsWith('images/')) {
    targetUrl = `${IMAGE_BASE}/${path.replace('images/', '')}`;
  } else {
    targetUrl = `${API_BASE}/${path}${url.search}`;
  }

  const headers = new Headers(context.request.headers);
  headers.set('trakt-api-key', context.env.VITE_TRAKT_API_KEY);
  headers.set('trakt-api-version', '2');
  headers.set('Content-Type', 'application/json');

  const response = await fetch(targetUrl, {
    method: context.request.method,
    headers: headers,
    body: context.request.method === 'GET' ? null : context.request.body,
  });

  return response;
}