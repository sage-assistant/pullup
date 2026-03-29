import { openai, requireOpenAIKey } from '@/lib/openai';

export const runtime = 'nodejs';

// Uses GPT to extract structured info from the conversation so far
export async function POST(request: Request) {
  requireOpenAIKey();
  const { messages } = (await request.json()) as {
    messages: Array<{ role: string; content: string }>;
  };

  const response = await openai.responses.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    instructions: [
      'Extract structured information from this conversation between a user and an AI Oracle.',
      'The user is trying to convince a friend to come out tonight. Extract whatever info is available.',
      'Return ONLY valid JSON with these fields (use null for unknown):',
      '{"venueName": string|null, "city": string|null, "time": string|null, "targetName": string|null, "targetCity": string|null, "squad": string[]|null, "excuse": string|null, "context": string|null, "outrageLevel": number|null}',
      'For targetCity, if not explicitly stated, use the same city as the venue city.',
      'For squad, extract any names of people who ARE coming (not the target).',
      'For excuse, extract what excuse the target friend is giving for not coming.',
      'For context, extract any inside jokes, relationships, or extra details.',
      'Return ONLY the JSON object, no markdown fences, no explanation.',
    ].join(' '),
    input: messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
  });

  try {
    const text = response.output_text.trim();
    const cleaned = text.replace(/^```json?\s*/i, '').replace(/\s*```$/, '');
    const extracted = JSON.parse(cleaned);
    return Response.json(extracted);
  } catch {
    return Response.json({});
  }
}
