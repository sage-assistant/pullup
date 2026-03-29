import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const GENERATED_DIR = process.env.VERCEL ? '/tmp/generated-sites' : path.join(process.cwd(), 'generated-sites');

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

export async function ensureGeneratedDir() {
  await mkdir(GENERATED_DIR, { recursive: true });
}

export async function writeGeneratedSite(slug: string, html: string) {
  await ensureGeneratedDir();
  await writeFile(path.join(GENERATED_DIR, `${slug}.html`), html, 'utf8');
}

export async function readGeneratedSite(slug: string) {
  return readFile(path.join(GENERATED_DIR, `${slug}.html`), 'utf8');
}
