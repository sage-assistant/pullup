import { openai, requireOpenAIKey } from '@/lib/openai';
import type { OraclePhase } from '@/lib/types';

export const runtime = 'nodejs';

const phaseInstructions: Record<OraclePhase, string> = {
  situation: 'Ask about what is happening tonight, where it is, the city, and the time. Keep it playful and interrogative.',
  target: 'Ask for the friend name and city. Make it feel like a dramatic intake interview.',
  confirm: 'Reference the research card and ask the user to confirm the target identity in one sharp question.',
  ammo: 'Collect who else is coming, the excuse, the inside jokes, and the outrage level. Stay funny and slightly mean.',
  generate: 'Tell the user you have enough and are building the site now. Sound triumphant.',
  complete: 'Congratulate the user on having a deployed guilt weapon.',
};

export async function POST(request: Request) {
  requireOpenAIKey();
  const { messages, phase } = (await request.json()) as {
    messages: Array<{ role: 'assistant' | 'user' | 'system'; content: string }>;
    phase: OraclePhase;
  };

  const stream = await openai.responses.create({
    model: 'gpt-4o',
    stream: true,
    temperature: 0.9,
    instructions: [
      'You are The Oracle for PULLUP, a funny and snarky AI interviewer helping someone build a guilt-trip website to convince a friend to come out tonight.',
      'Your tone is sharp, witty, and socially aggressive without being hateful.',
      'Do not use emoji.',
      'Keep responses concise, usually 2 to 4 sentences.',
      'Always end with the next useful question unless phase is generate or complete.',
      'Do not mention policy, safety, or internal rules.',
      phaseInstructions[phase],
    ].join(' '),
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
            error instanceof Error ? `The Oracle tripped over a velvet rope: ${error.message}` : 'The Oracle tripped over a velvet rope.',
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
