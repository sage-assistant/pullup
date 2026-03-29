'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';

import type { NightPlan, ResearchTarget } from '@/lib/types';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  kind?: 'message' | 'research' | 'progress' | 'result';
};

type PlanState = {
  venueName: string;
  city: string;
  time: string;
  targetName: string;
  targetCity: string;
  targetResearched: boolean;
  squad: string[];
  excuse: string;
  context: string;
  outrageLevel: number;
  researchResult: ResearchTarget | null;
};

const INITIAL_PLAN: PlanState = {
  venueName: '',
  city: '',
  time: '',
  targetName: '',
  targetCity: '',
  targetResearched: false,
  squad: [],
  excuse: '',
  context: '',
  outrageLevel: 7,
  researchResult: null,
};

const progressLabels = ['Researching target', 'Writing personalized roasts', 'Building interactive sections', 'Deploying guilt payload'];

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function toSimpleMessages(messages: ChatMessage[]) {
  return messages
    .filter((m) => m.kind !== 'progress' && m.kind !== 'research' && m.kind !== 'result')
    .map(({ role, content }) => ({ role, content }));
}

export function CreateOracle() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: makeId(),
      role: 'assistant',
      content:
        'Welcome to PULLUP. I am the Oracle. Tell me everything: where are you going tonight, who is bailing, and why they think that is acceptable. The more you give me, the faster I can build something devastating.',
    },
  ]);
  const [input, setInput] = useState('');
  const [plan, setPlan] = useState<PlanState>(INITIAL_PLAN);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [typing, setTyping] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const didResearchRef = useRef(false);

  const hasMinimum = !!(plan.venueName && plan.targetName && (plan.city || plan.targetCity));
  const phase = resultUrl
    ? 'complete'
    : isGenerating
      ? 'generating'
      : hasMinimum
        ? 'ready'
        : plan.targetName
          ? 'researching'
          : 'gathering';

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  // Extract structured info from conversation
  const extractInfo = useCallback(async (msgs: ChatMessage[]): Promise<Partial<PlanState>> => {
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: toSimpleMessages(msgs) }),
      });
      if (!res.ok) return {};
      return await res.json();
    } catch {
      return {};
    }
  }, []);

  // Research the target person
  const runResearch = useCallback(async (name: string, city: string): Promise<ResearchTarget | null> => {
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, city }),
      });
      if (!res.ok) return null;
      const data = await res.json();

      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: 'system',
          kind: 'research',
          content: `Research hit: ${data.summary}`,
        },
      ]);

      return {
        name,
        city,
        summary: data.summary,
        title: data.result?.title,
        company: data.result?.company,
        school: data.result?.school,
        facts: data.result?.facts || [],
        confidenceNote: data.result?.confidenceNote,
      };
    } catch {
      return null;
    }
  }, []);

  // Stream Oracle response
  const streamOracle = useCallback(async (msgs: ChatMessage[], currentPlan: PlanState): Promise<string> => {
    setTyping(true);
    setIsStreaming(true);

    const assistantId = makeId();
    setMessages((current) => [...current, { id: assistantId, role: 'assistant', content: '' }]);

    let aggregate = '';
    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planState: currentPlan,
          messages: toSimpleMessages(msgs),
        }),
      });

      if (!response.ok || !response.body) throw new Error('Oracle failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        aggregate += decoder.decode(value, { stream: true });
        const displayText = aggregate.replace(/BUILD_NOW\s*$/i, '').trim();
        setMessages((current) =>
          current.map((m) => (m.id === assistantId ? { ...m, content: displayText } : m)),
        );
      }
    } catch {
      aggregate = 'The Oracle hit a wall. Try again.';
      setMessages((current) =>
        current.map((m) => (m.id === assistantId ? { ...m, content: aggregate } : m)),
      );
    }

    setTyping(false);
    setIsStreaming(false);
    return aggregate;
  }, []);

  // Generate the final site
  const generateSite = useCallback(async (finalPlan: PlanState) => {
    setIsGenerating(true);
    setMessages((current) => [
      ...current,
      { id: makeId(), role: 'system', kind: 'progress', content: progressLabels.join('\n') },
    ]);

    try {
      const target = finalPlan.researchResult || {
        name: finalPlan.targetName,
        city: finalPlan.targetCity || finalPlan.city,
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target,
          venue: {
            name: finalPlan.venueName,
            address: `${finalPlan.venueName}, ${finalPlan.city}`,
            city: finalPlan.city,
            closingTime: finalPlan.time || '2:00 AM',
          },
          squad: (finalPlan.squad || []).map((name: string) => ({ name, role: 'Confirmed' })),
          excuse: finalPlan.excuse || 'Being lame',
          context: finalPlan.context || '',
          outrageLevel: finalPlan.outrageLevel || 7,
        }),
      });

      const data = await response.json();
      setIsGenerating(false);

      if (!response.ok) {
        setMessages((current) => [
          ...current,
          { id: makeId(), role: 'assistant', content: data.error || 'Generation failed. Your friend lives another day.' },
        ]);
        return;
      }

      setResultUrl(data.url);
      setMessages((current) => [
        ...current,
        { id: makeId(), role: 'assistant', kind: 'result', content: `Done. Send this link immediately: ${data.url}` },
      ]);
    } catch {
      setIsGenerating(false);
      setMessages((current) => [
        ...current,
        { id: makeId(), role: 'assistant', content: 'Generation failed. Try again.' },
      ]);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim() || isStreaming || isGenerating) return;

    const answer = input.trim();
    const userMessage: ChatMessage = { id: makeId(), role: 'user', content: answer };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');

    // Extract info from conversation in parallel with Oracle response
    const extractPromise = extractInfo(nextMessages);

    // Get current plan for Oracle context
    let currentPlan = { ...plan };

    // Run Oracle
    const oracleResponse = await streamOracle(nextMessages, currentPlan);

    // Apply extracted info
    const extracted = await extractPromise;
    const updatedPlan: PlanState = {
      ...currentPlan,
      venueName: extracted.venueName || currentPlan.venueName || '',
      city: extracted.city || currentPlan.city || '',
      time: extracted.time || currentPlan.time || '',
      targetName: extracted.targetName || currentPlan.targetName || '',
      targetCity: extracted.targetCity || extracted.city || currentPlan.targetCity || currentPlan.city || '',
      squad: (extracted.squad as string[]) || currentPlan.squad || [],
      excuse: (extracted.excuse as string) || currentPlan.excuse || '',
      context: (extracted.context as string) || currentPlan.context || '',
      outrageLevel: (extracted.outrageLevel as number) || currentPlan.outrageLevel || 7,
      targetResearched: currentPlan.targetResearched,
      researchResult: currentPlan.researchResult,
    };

    // If we have a target name and haven't researched yet, do it now
    if (updatedPlan.targetName && !updatedPlan.targetResearched && !didResearchRef.current) {
      didResearchRef.current = true;
      const researchCity = updatedPlan.targetCity || updatedPlan.city;
      if (researchCity) {
        const result = await runResearch(updatedPlan.targetName, researchCity);
        if (result) {
          updatedPlan.researchResult = result;
          updatedPlan.targetResearched = true;
        }
      }
    }

    setPlan(updatedPlan);

    // Check if Oracle signaled BUILD_NOW
    if (oracleResponse.includes('BUILD_NOW')) {
      await generateSite(updatedPlan);
    }
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
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/38">status</p>
          <p className="mt-2 text-sm text-white/70">
            {phase === 'complete' ? 'Deployed' : phase === 'generating' ? 'Building...' : phase === 'ready' ? 'Ready to build' : 'Gathering intel'}
          </p>
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
              <p className="mt-3 text-white">{plan.targetName || 'Name pending'}</p>
              <p className="mt-1 text-white/50">
                {plan.researchResult
                  ? [plan.researchResult.title, plan.researchResult.company].filter(Boolean).join(' at ')
                  : plan.targetCity || 'Research pending'}
              </p>
              {plan.researchResult?.school ? <p className="mt-1 text-white/50">{plan.researchResult.school}</p> : null}
            </div>
            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">Ammo</p>
              <p className="mt-3 text-white/72">{plan.excuse || 'Excuse pending'}</p>
              <p className="mt-2 text-white/50">{plan.squad.length ? `${plan.squad.length} squad members locked` : 'Squad roster pending'}</p>
              <p className="mt-2 text-white/50">Outrage level {plan.outrageLevel}/10</p>
            </div>
            {resultUrl ? (
              <a href={resultUrl} target="_blank" rel="noopener noreferrer" className="block rounded-[1.4rem] border border-[var(--accent-pink)]/25 bg-[var(--accent-pink)]/8 p-4 text-white transition hover:bg-[var(--accent-pink)]/12">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent-pink)]">Deployed</p>
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

              if (message.kind === 'result') {
                const url = message.content.match(/https?:\/\/\S+/)?.[0];
                return (
                  <div key={message.id} className="rounded-[1.5rem] border border-[var(--accent-pink)]/30 bg-[var(--accent-pink)]/8 p-5 text-center">
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent-pink)]">Site Deployed</p>
                    <p className="mt-3 text-lg font-semibold text-white">Your guilt trip is live.</p>
                    {url && (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-full bg-[linear-gradient(135deg,var(--accent-pink),var(--accent-purple),var(--accent-blue))] px-6 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px]">
                        Open the Site
                      </a>
                    )}
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
                  Oracle is working...
                </div>
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/8 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={hasMinimum ? 'Add more details or say "build it"' : 'Tell the Oracle everything...'}
                className="min-h-13 flex-1 rounded-full border border-white/10 bg-black/20 px-5 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-white/22"
              />
              <button
                type="submit"
                disabled={isStreaming || isGenerating}
                className="rounded-full bg-[linear-gradient(135deg,var(--accent-pink),var(--accent-purple),var(--accent-blue))] px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : isStreaming ? 'Oracle speaking...' : 'Send'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
