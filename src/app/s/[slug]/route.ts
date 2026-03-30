import { list } from '@vercel/blob';

export const runtime = 'nodejs';

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  
  // Find the blob by prefix
  const { blobs } = await list({ prefix: `sites/${slug}`, limit: 1 });
  
  if (!blobs.length) {
    return new Response('<h1>Site not found</h1>', {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // Fetch the blob content
  const blobResponse = await fetch(blobs[0].downloadUrl);
  const html = await blobResponse.text();

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
