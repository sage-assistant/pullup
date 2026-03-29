import { put } from '@vercel/blob';

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

export function buildSiteSlug(targetName: string, venueName: string) {
  const seed = `${slugify(targetName)}-${slugify(venueName)}-${Date.now().toString(36)}`;
  return seed.slice(0, 72);
}

export async function writeGeneratedSite(slug: string, html: string): Promise<string> {
  const blob = await put(`sites/${slug}.html`, html, {
    access: 'public',
    contentType: 'text/html; charset=utf-8',
    addRandomSuffix: false,
  });
  return blob.url;
}
