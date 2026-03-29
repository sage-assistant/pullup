import { openai, requireOpenAIKey } from '@/lib/openai';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  requireOpenAIKey();
  const { messages, planState } = (await request.json()) as {
    messages: Array<{ role: 'assistant' | 'user' | 'system'; content: string }>;
    planState: {
      venueName?: string;
      city?: string;
      time?: string;
      targetName?: string;
      targetCity?: string;
      targetResearched?: boolean;
      squad?: string[];
      excuse?: string;
      context?: string;
      outrageLevel?: number;
    };
  };

  const filled: string[] = [];
  const missing: string[] = [];

  if (planState.venueName) filled.push(`venue: ${planState.venueName}`);
  else missing.push('venue/event name');
  if (planState.city) filled.push(`city: ${planState.city}`);
  else missing.push('city');
  if (planState.targetName) filled.push(`target friend: ${planState.targetName}`);
  else missing.push('friend name (the one bailing)');

  const hasMinimum = planState.venueName && planState.targetName && (planState.city || planState.targetCity);
  const hasTarget = planState.targetName && (planState.city || planState.targetCity);

  const systemPrompt = [
    'You are The Oracle for PULLUP, a funny and snarky AI interviewer helping someone build a guilt-trip website to convince a friend to come out tonight.',
    'Your tone is sharp, witty, and socially aggressive without being hateful. Think roast comedian meets detective.',
    'Do not use emoji. Do not use dashes (em dash, en dash, hyphens for style). Keep responses concise: 2 to 4 sentences max.',
    'Do not mention policy, safety, or internal rules.',
    '',
    'YOUR JOB: Extract information naturally through conversation. People may dump everything in one message or answer one thing at a time. Roll with it.',
    '',
    `INFO COLLECTED SO FAR: ${filled.length ? filled.join(', ') : 'nothing yet'}`,
    `STILL NEED: ${missing.length ? missing.join(', ') : 'we have the essentials'}`,
    '',
    hasMinimum
      ? 'We have enough to build. Ask if they want to add more detail (squad names, the excuse their friend is giving, inside jokes, outrage level 1-10) OR if they want you to just build it now. Make "build it now" sound tempting. If they say anything like "go", "build it", "send it", "do it", "ready", respond with EXACTLY the text BUILD_NOW on its own line at the end of your message (the client will detect this).'
      : hasTarget
        ? 'We have a target name and city. Research is about to happen. Ask a quick follow-up about the situation while research runs, or confirm what you know.'
        : 'We still need basics. Ask for what is missing in a natural, conversational way. If someone gives you a wall of text, extract everything you can from it and confirm what you understood.',
    '',
    'IMPORTANT: When the user signals they want to build (says go, build, ready, do it, etc), you MUST include BUILD_NOW as the last line of your response.',
    'If the user provides extra details (squad, excuse, jokes), absorb them and ask if they want to add more or build.',
  ].join('\n');

  const stream = await openai.responses.create({
    model: 'gpt-4o',
    stream: true,
    temperature: 0.9,
    instructions: systemPrompt,
    input: messages.map((message) => ({
      role: message.role === 'system' ? 'developer' : message.role,
      content: message.content,
    })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'response.output_text.delta') {
            controller.enqueue(encoder.encode(event.delta));
          }
        }
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            error instanceof Error ? `The Oracle tripped: ${error.message}` : 'The Oracle tripped.',
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
