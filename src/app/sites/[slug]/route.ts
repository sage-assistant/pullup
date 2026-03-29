import { readGeneratedSite } from '@/lib/generated-sites';

export const runtime = 'nodejs';

export async function GET(_request: Request, context: RouteContext<'/sites/[slug]'>) {
  const { slug } = await context.params;

  try {
    const html = await readGeneratedSite(slug);
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return new Response('<h1>Site not found</h1>', {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}
