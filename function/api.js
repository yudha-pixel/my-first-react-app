const API_BASE = 'https://api.trakt.tv';
const IMAGE_BASE = 'https://walter.trakt.tv';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.replace('/api/', ''); // Hapus /api/ dari path

  let targetUrl;

  if (path.startsWith('images/')) {
    targetUrl = `${IMAGE_BASE}/${path}`;
  } else {
    targetUrl = `${API_BASE}/${path}${url.search}`;
  }

  const request = new Request(targetUrl, context.request);
  request.headers.set('Origin', new URL(targetUrl).origin);

  const response = await fetch(request);

  const newResponse = new Response(response.body, response);
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', '*');

  return newResponse;
}