import { buildSiteSlug, writeGeneratedSite } from '@/lib/generated-sites';
import { stripHtmlFences } from '@/lib/oracle-flow';
import { openai, requireOpenAIKey } from '@/lib/openai';
import type { NightPlan } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

function buildPrompt(data: NightPlan) {
  return `
Generate a complete self-contained HTML document for a Swiss terminal minimal interactive website that guilt-trips ${data.target.name} into going out tonight.

Requirements:
- Output raw HTML only. No markdown fences. No explanations.
- Use inline CSS and inline JavaScript only.
- Design system must strictly use:
  - Background: #FFFFFF
  - Text: #000000
  - Accent: #39FF14
  - Borders: #E0E0E0
  - Surface: #F8F8F8
  - Muted text: #666666
- Fonts must be loaded from Google Fonts: Inter and Space Mono.
- Headlines use Inter with very heavy weight, uppercase, and tight spacing.
- Body and UI labels use Space Mono.
- Labels should be uppercase with wide tracking.
- Style direction: Swiss poster energy meets hacker terminal.
- No gradients, no shadows, no glass effects, no decorative illustrations.
- Use only thin 1px solid borders.
- White background everywhere. Black text everywhere. Neon lime is the only accent color.
- Personalize to this target:
  - Name: ${data.target.name}
  - City: ${data.target.city}
  - Title: ${data.target.title || 'Unknown'}
  - Company: ${data.target.company || 'Unknown'}
  - School: ${data.target.school || 'Unknown'}
  - Facts: ${(data.target.facts || []).join(' | ') || 'None'}
- Tonight's plan:
  - Venue: ${data.venueName}
  - Address: ${data.venueAddress}
  - City: ${data.city}
  - Closing time: ${data.time}
- Squad roster: ${data.squad.map((member) => `${member.name} (${member.role})`).join(', ') || 'No roster provided'}
- Excuse to destroy: ${data.excuse}
- Inside jokes and context: ${data.context}
- Outrage level: ${data.outrageLevel}/10

Must include:
- Splash screen / entry state
- Hero with dramatic headline and clear CTA
- Personalized roast section tied to career, company, school, and facts
- Interactive excuse destroyer
- Squad roster
- Live countdown timer
- FOMO analysis stats
- Two timelines: stays home vs shows up
- Petition section with fake signatures
- Venue directions / final CTA
- At least two Easter eggs
- Mobile responsive layout
- No emojis
- Marketing copy must not use em dashes or en dashes
- Layout should feel grid-based, minimal, and sharply aligned
- Chat or terminal-like callouts can use prefixes like "oracle >" and "you >"

Make it funny, sharp, and specific. Include meaningful motion and interactive controls.
  `.trim();
}

export async function POST(request: Request) {
  requireOpenAIKey();
  const body = (await request.json()) as {
    target: NightPlan['target'];
    venue: { name: string; address: string; city: string; closingTime: string };
    squad: NightPlan['squad'];
    excuse: string;
    context: string;
    outrageLevel: number;
  };

  const plan: NightPlan = {
    venueName: body.venue.name,
    venueAddress: body.venue.address,
    city: body.venue.city,
    time: body.venue.closingTime,
    target: body.target,
    squad: body.squad,
    excuse: body.excuse,
    context: body.context,
    outrageLevel: body.outrageLevel,
  };

  try {
    const response = await openai.responses.create({
      model: 'gpt-4o',
      instructions:
        'You are an elite creative developer generating a world-class single-file HTML experience. Return only valid HTML that runs in a browser with no external dependencies besides Google Fonts. Output the full HTML document and nothing else.',
      input: buildPrompt(plan),
      temperature: 0.95,
      max_output_tokens: 16000,
    });

    const html = stripHtmlFences(response.output_text);

    if (!html.toLowerCase().includes('<html')) {
      return Response.json({ error: 'Model did not return a full HTML document. Try again.' }, { status: 502 });
    }

    const slug = buildSiteSlug(plan.target.name, plan.venueName);
    const blobUrl = await writeGeneratedSite(slug, html);

    return Response.json({
      slug,
      url: blobUrl,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown generation error';
    console.error('Generate error:', message);
    return Response.json({ error: `Generation failed: ${message}` }, { status: 500 });
  }
}
