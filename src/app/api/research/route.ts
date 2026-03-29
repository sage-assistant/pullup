import { openai, requireOpenAIKey } from '@/lib/openai';

export const runtime = 'nodejs';

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function POST(request: Request) {
  requireOpenAIKey();
  const { name, city } = (await request.json()) as { name: string; city: string };

  if (!name || !city) {
    return Response.json({ error: 'name and city are required' }, { status: 400 });
  }

  const response = await openai.responses.create({
    model: 'gpt-4o',
    tools: [
      {
        type: 'web_search_preview',
        user_location: {
          type: 'approximate',
          city,
          country: 'US',
        },
        search_context_size: 'medium',
      },
    ],
    include: ['web_search_call.action.sources'],
    instructions: [
      'Research a likely public profile for the named person.',
      'Return strict JSON with keys: summary, name, title, company, school, facts, confidenceNote.',
      'facts must be an array of short strings.',
      'If identity is uncertain, say so clearly in confidenceNote and keep unsupported fields empty strings.',
    ].join(' '),
    input: `Search for ${name} in ${city}. Return job title, company, school, public facts, and a short confidence note.`,
    temperature: 0.2,
  });

  const parsed = safeJsonParse<{
    summary?: string;
    name?: string;
    title?: string;
    company?: string;
    school?: string;
    facts?: string[];
    confidenceNote?: string;
  }>(response.output_text, {});

  const summary =
    parsed.summary ||
    `${parsed.name || name}${parsed.title ? ` appears to be ${parsed.title}` : ''}${parsed.company ? ` at ${parsed.company}` : ''}${parsed.school ? `, tied to ${parsed.school}` : ''}.`;

  return Response.json({
    summary,
    result: {
      name: parsed.name || name,
      title: parsed.title || '',
      company: parsed.company || '',
      school: parsed.school || '',
      facts: parsed.facts || [],
      confidenceNote: parsed.confidenceNote || '',
    },
  });
}
