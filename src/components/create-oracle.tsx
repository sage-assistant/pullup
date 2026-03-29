'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { getPhaseForStep, ORACLE_STEPS, parseOutrageLevel, parseSquad } from '@/lib/oracle-flow';
import type { NightPlan, OraclePhase, ResearchTarget } from '@/lib/types';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  kind?: 'message' | 'research' | 'progress' | 'result';
};

const INITIAL_STATE: NightPlan = {
  venueName: '',
  venueAddress: '',
  city: '',
  time: '',
  target: {
    name: '',
    city: '',
    facts: [],
  },
  squad: [],
  excuse: '',
  context: '',
  outrageLevel: 7,
};

const progressLabels = ['Researching target', 'Writing personalized roasts', 'Building timelines', 'Deploying guilt payload'];

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function toOracleMessages(messages: ChatMessage[]) {
  return messages
    .filter((message) => message.kind !== 'progress' && message.kind !== 'research' && message.kind !== 'result')
    .map(({ role, content }) => ({ role, content }));
}

export function CreateOracle() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: makeId(),
      role: 'assistant',
      content:
        'Welcome to PULLUP. I am the Oracle, which means I ask invasive questions for the public good. What are we trying to get your friend to show up for tonight?',
    },
  ]);
  const [input, setInput] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const [plan, setPlan] = useState<NightPlan>(INITIAL_STATE);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [typing, setTyping] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const phase: OraclePhase = resultUrl ? 'complete' : getPhaseForStep(stepIndex);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  async function streamOracle(nextMessages: ChatMessage[], currentPhase: OraclePhase) {
    setTyping(true);
    setIsStreaming(true);

    const assistantId = makeId();
    setMessages((current) => [...current, { id: assistantId, role: 'assistant', content: '' }]);

    const response = await fetch('/api/oracle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phase: currentPhase,
        messages: toOracleMessages(nextMessages),
      }),
    });

    if (!response.ok || !response.body) {
      setTyping(false);
      setIsStreaming(false);
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content: 'The Oracle hit a wall. Try that again so I can continue professionally judging your friend.',
              }
            : message,
        ),
      );
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aggregate = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      aggregate += decoder.decode(value, { stream: true });
      setMessages((current) =>
        current.map((message) => (message.id === assistantId ? { ...message, content: aggregate } : message)),
      );
    }

    setTyping(false);
    setIsStreaming(false);
  }

  async function runResearch(target: ResearchTarget) {
    const response = await fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: target.name, city: target.city }),
    });
    const data = await response.json();

    const researchedTarget: ResearchTarget = {
      ...target,
      summary: data.summary,
      title: data.result?.title,
      company: data.result?.company,
      school: data.result?.school,
      facts: data.result?.facts || [],
      confidenceNote: data.result?.confidenceNote,
    };

    setPlan((current) => ({ ...current, target: researchedTarget }));
    setMessages((current) => [
      ...current,
      {
        id: makeId(),
        role: 'system',
        kind: 'research',
        content: `Research hit: ${data.summary}`,
      },
    ]);

    return researchedTarget;
  }

  function applyAnswer(answer: string) {
    const stepKey = ORACLE_STEPS[stepIndex]?.key;
    if (!stepKey) return plan;

    if (stepKey === 'venueName') {
      return { ...plan, venueName: answer, venueAddress: `${answer}, ${plan.city || 'TBD'}` };
    }
    if (stepKey === 'city') {
      return { ...plan, city: answer, venueAddress: plan.venueName ? `${plan.venueName}, ${answer}` : answer };
    }
    if (stepKey === 'time') {
      return { ...plan, time: answer };
    }
    if (stepKey === 'targetName') {
      return { ...plan, target: { ...plan.target, name: answer } };
    }
    if (stepKey === 'targetCity') {
      return { ...plan, target: { ...plan.target, city: answer || plan.city } };
    }
    if (stepKey === 'squad') {
      return { ...plan, squad: parseSquad(answer) };
    }
    if (stepKey === 'excuse') {
      return { ...plan, excuse: answer };
    }
    if (stepKey === 'context') {
      return { ...plan, context: answer };
    }
    if (stepKey === 'outrageLevel') {
      return { ...plan, outrageLevel: parseOutrageLevel(answer) };
    }
    return plan;
  }

  async function generateSite(finalPlan: NightPlan) {
    setIsGenerating(true);
    setMessages((current) => [
      ...current,
      {
        id: makeId(),
        role: 'system',
        kind: 'progress',
        content: progressLabels.join('\n'),
      },
    ]);

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target: finalPlan.target,
        venue: {
          name: finalPlan.venueName,
          address: finalPlan.venueAddress,
          city: finalPlan.city,
          closingTime: finalPlan.time,
        },
        squad: finalPlan.squad,
        excuse: finalPlan.excuse,
        context: finalPlan.context,
        outrageLevel: finalPlan.outrageLevel,
      }),
    });

    const data = await response.json();
    setIsGenerating(false);

    if (!response.ok) {
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: 'assistant',
          content: data.error || 'Site generation failed. Your friend lives to stall another minute.',
        },
      ]);
      return;
    }

    setResultUrl(data.url);
    setMessages((current) => [
      ...current,
      {
        id: makeId(),
        role: 'assistant',
        kind: 'result',
        content: `Weaponized. Send this immediately: ${data.url}`,
      },
    ]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim() || isStreaming || isGenerating) return;

    const answer = input.trim();
    const userMessage: ChatMessage = { id: makeId(), role: 'user', content: answer };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');

    let nextPlan = applyAnswer(answer);
    setPlan(nextPlan);

    if (ORACLE_STEPS[stepIndex]?.key === 'targetCity') {
      nextPlan = { ...nextPlan, target: await runResearch(nextPlan.target) };
      setPlan(nextPlan);
    }

    const nextStepIndex = stepIndex + 1;
    setStepIndex(nextStepIndex);

    if (nextStepIndex >= ORACLE_STEPS.length) {
      await streamOracle(nextMessages, 'generate');
      await generateSite(nextPlan);
      return;
    }

    await streamOracle(nextMessages, getPhaseForStep(nextStepIndex));
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <div className="glass-surface flex items-center justify-between rounded-[1.75rem] px-5 py-4">
        <div>
          <Link href="/" className="font-mono text-xs uppercase tracking-[0.3em] text-white/55">
            PULLUP
          </Link>
          <h1 className="mt-2 font-serif text-3xl tracking-[-0.04em] text-white sm:text-4xl">Oracle Session</h1>
        </div>
        <div className="text-right">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/38">phase</p>
          <p className="mt-2 text-sm text-white/70">{phase}</p>
        </div>
      </div>

      <div className="grid flex-1 gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="glass-panel rounded-[2rem] p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent-cyan)]">Build State</p>
          <div className="mt-5 space-y-4 text-sm text-white/65">
            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">Tonight</p>
              <p className="mt-3 text-white">{plan.venueName || 'Venue pending'}</p>
              <p className="mt-1 text-white/50">{plan.city || 'City pending'} · {plan.time || 'Time pending'}</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">Target</p>
              <p className="mt-3 text-white">{plan.target.name || 'Name pending'}</p>
              <p className="mt-1 text-white/50">
                {[plan.target.title, plan.target.company].filter(Boolean).join(' at ') || plan.target.city || 'Research pending'}
              </p>
              {plan.target.school ? <p className="mt-1 text-white/50">{plan.target.school}</p> : null}
            </div>
            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">Ammo</p>
              <p className="mt-3 text-white/72">{plan.excuse || 'Excuse pending'}</p>
              <p className="mt-2 text-white/50">{plan.squad.length ? `${plan.squad.length} squad members locked` : 'Squad roster pending'}</p>
              <p className="mt-2 text-white/50">Outrage level {plan.outrageLevel}/10</p>
            </div>
            {resultUrl ? (
              <a href={resultUrl} className="block rounded-[1.4rem] border border-[var(--accent-pink)]/25 bg-[var(--accent-pink)]/8 p-4 text-white transition hover:bg-[var(--accent-pink)]/12">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent-pink)]">Deploy Result</p>
                <p className="mt-3 text-sm leading-7">Open the generated site</p>
              </a>
            ) : null}
          </div>
        </aside>

        <section className="glass-panel flex min-h-[70vh] flex-col overflow-hidden rounded-[2rem]">
          <div ref={scrollerRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
            {messages.map((message) => {
              if (message.kind === 'research') {
                return (
                  <div key={message.id} className="rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/8 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200">Research Card</p>
                    <p className="mt-3 text-sm leading-7 text-white/75">{message.content}</p>
                  </div>
                );
              }

              if (message.kind === 'progress') {
                return (
                  <div key={message.id} className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/42">Build Progress</p>
                    <div className="mt-4 space-y-3">
                      {progressLabels.map((label, index) => (
                        <div key={label} className="flex items-center gap-3 text-sm text-white/70">
                          <div className={`h-2.5 w-2.5 rounded-full ${isGenerating || index < progressLabels.length - 1 ? 'bg-[var(--accent-pink)] animate-pulse' : 'bg-white/12'}`} />
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              const isAssistant = message.role === 'assistant';
              return (
                <div key={message.id} className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[90%] rounded-[1.6rem] px-4 py-3 text-sm leading-7 sm:max-w-[78%] ${
                      isAssistant
                        ? 'border border-white/8 bg-white/[0.045] text-white/80'
                        : 'bg-[linear-gradient(135deg,var(--accent-pink),var(--accent-purple),var(--accent-blue))] text-white shadow-[0_16px_50px_rgba(255,45,120,0.2)]'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}

            {typing ? (
              <div className="flex justify-start">
                <div className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-white/55">
                  Oracle is preparing a rude follow-up
                </div>
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/8 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your answer so the Oracle can keep building"
                className="min-h-13 flex-1 rounded-full border border-white/10 bg-black/20 px-5 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-white/22"
              />
              <button
                type="submit"
                disabled={isStreaming || isGenerating}
                className="rounded-full bg-[linear-gradient(135deg,var(--accent-pink),var(--accent-purple),var(--accent-blue))] px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating ? 'Generating site' : isStreaming ? 'Oracle speaking' : 'Send'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
