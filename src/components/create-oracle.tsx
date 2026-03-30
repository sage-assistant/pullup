'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';

import type { ResearchTarget } from '@/lib/types';

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

function makeAsciiBar(activeIndex: number, index: number) {
  const filled = index <= activeIndex ? 4 : 0;
  return `[${'='.repeat(filled)}${'-'.repeat(4 - filled)}]`;
}

function statusLabel(phase: string) {
  if (phase === 'complete') return 'DEPLOYED';
  if (phase === 'generating') return 'BUILDING';
  if (phase === 'ready') return 'READY TO BUILD';
  return 'GATHERING INTEL';
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

    const extractPromise = extractInfo(nextMessages);
    const currentPlan = { ...plan };
    const oracleResponse = await streamOracle(nextMessages, currentPlan);

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

    if (oracleResponse.includes('BUILD_NOW')) {
      await generateSite(updatedPlan);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 bg-white px-4 py-4 text-black sm:px-6 sm:py-6 lg:px-8">
      <header className="grid gap-4 border border-black p-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#666666]">
            PULLUP
          </Link>
          <h1 className="mt-3 font-sans text-4xl font-black uppercase tracking-[-0.06em]">ORACLE SESSION</h1>
        </div>
        <div className="border border-black p-4 text-left md:min-w-64 md:text-right">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#666666]">STATUS</p>
          <div className="mt-3 flex items-center gap-3 md:justify-end">
            <span className="h-2 w-2 rounded-full bg-[#39FF14]" />
            <span className="font-mono text-sm uppercase tracking-[0.22em]">{statusLabel(phase)}</span>
          </div>
        </div>
      </header>

      <div className="grid flex-1 gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.85fr)]">
        <section className="order-1 flex min-h-[70vh] flex-col border border-black lg:order-1">
          <div className="border-b border-black px-4 py-3 font-mono text-[11px] uppercase tracking-[0.34em] text-[#666666] sm:px-5">
            TERMINAL
          </div>

          <div ref={scrollerRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4 font-mono text-sm leading-7 sm:px-5">
            {messages.map((message) => {
              if (message.kind === 'research') {
                return (
                  <div key={message.id} className="border border-[#39FF14] p-4">
                    <p className="text-[11px] uppercase tracking-[0.34em] text-[#666666]">RESEARCH CARD</p>
                    <p className="mt-3 text-black">oracle &gt; {message.content}</p>
                  </div>
                );
              }

              if (message.kind === 'progress') {
                return (
                  <div key={message.id} className="border border-black bg-[#f8f8f8] p-4">
                    <p className="text-[11px] uppercase tracking-[0.34em] text-[#666666]">BUILD PROGRESS</p>
                    <div className="mt-4 space-y-3">
                      {progressLabels.map((label, index) => {
                        const activeIndex = isGenerating ? progressLabels.length - 1 : progressLabels.length - 1;
                        return (
                          <div key={label} className="flex flex-wrap items-center gap-3 text-black">
                            <span className="uppercase tracking-[0.18em] text-[#39FF14]">{makeAsciiBar(activeIndex, index)}</span>
                            <span>{label.toUpperCase()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              if (message.kind === 'result') {
                const rawUrl = resultUrl || message.content.match(/https?:\/\/\S+/)?.[0] || message.content.match(/\/s\/\S+/)?.[0] || message.content.match(/\/sites\/\S+/)?.[0];
                const siteUrl = rawUrl?.startsWith('/') ? `${typeof window !== 'undefined' ? window.location.origin : ''}${rawUrl}` : rawUrl;
                return (
                  <div key={message.id} className="border border-black p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#666666]">RESULT</p>
                    <p className="mt-3 text-black">oracle &gt; [OK] YOUR GUILT TRIP IS LIVE.</p>
                    {siteUrl ? (
                      <>
                        <a
                          href={siteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 block border border-[#39FF14] p-4 font-mono text-sm text-[#39FF14] break-all hover:bg-[#39FF14]/10 transition"
                        >
                          {siteUrl}
                        </a>
                        <a
                          href={siteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center justify-center border border-black bg-[#39FF14] px-5 py-3 text-[11px] uppercase tracking-[0.32em] text-black transition hover:brightness-90"
                        >
                          OPEN SITE
                        </a>
                        <button
                          onClick={() => { navigator.clipboard.writeText(siteUrl); }}
                          className="mt-2 ml-3 inline-flex items-center justify-center border border-black px-5 py-3 text-[11px] uppercase tracking-[0.32em] text-black transition hover:bg-[#f8f8f8]"
                        >
                          COPY LINK
                        </button>
                      </>
                    ) : null}
                  </div>
                );
              }

              const label = message.role === 'assistant' ? 'oracle' : 'you';
              const borderColor = message.role === 'assistant' ? 'border-black' : 'border-[#39FF14]';
              const surface = message.role === 'assistant' ? 'bg-white' : 'bg-[#f8f8f8]';

              return (
                <div key={message.id} className={`border ${borderColor} ${surface} p-4`}>
                  <p className="text-[11px] uppercase tracking-[0.34em] text-[#666666]">{label} &gt;</p>
                  <p className="mt-2 whitespace-pre-wrap text-black">{message.content || (typing && label === 'oracle' ? '...' : '')}</p>
                </div>
              );
            })}

            {typing ? (
              <div className="border border-black bg-[#f8f8f8] p-4">
                <p className="text-[11px] uppercase tracking-[0.34em] text-[#666666]">ORACLE &gt;</p>
                <p className="mt-2 text-black">...</p>
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-black p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex min-h-13 flex-1 items-center gap-3 border border-black px-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.34em] text-black">you &gt;</span>
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={hasMinimum ? 'ADD MORE DETAILS OR SAY BUILD IT' : 'TELL THE ORACLE EVERYTHING'}
                  className="min-w-0 flex-1 bg-transparent font-mono text-sm text-black outline-none placeholder:text-[#666666]"
                />
                <span className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#39FF14]">|</span>
              </label>
              <button
                type="submit"
                disabled={isStreaming || isGenerating}
                className="border border-black bg-[#39FF14] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-black transition disabled:cursor-not-allowed disabled:border-[#e0e0e0] disabled:bg-white disabled:text-[#666666]"
              >
                {isGenerating ? 'GENERATING' : isStreaming ? 'ORACLE SPEAKING' : 'SEND'}
              </button>
            </div>
          </form>
        </section>

        <aside className="order-2 border border-black bg-[#f8f8f8] p-4 lg:order-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#666666]">BUILD STATE</p>
          <div className="mt-5 space-y-4 font-mono text-sm">
            <div className="border border-black bg-white p-4">
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#666666]">TONIGHT</p>
              <p className="mt-3 uppercase text-black">{plan.venueName || 'VENUE PENDING'}</p>
              <p className="mt-2 text-[#666666]">{[plan.city || 'CITY PENDING', plan.time || 'TIME PENDING'].join(' / ')}</p>
            </div>

            <div className="border border-black bg-white p-4">
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#666666]">TARGET</p>
              <p className="mt-3 uppercase text-black">{plan.targetName || 'NAME PENDING'}</p>
              <p className="mt-2 text-[#666666]">
                {plan.researchResult
                  ? [plan.researchResult.title, plan.researchResult.company].filter(Boolean).join(' AT ').toUpperCase()
                  : (plan.targetCity || 'RESEARCH PENDING').toUpperCase()}
              </p>
              {plan.researchResult?.school ? <p className="mt-2 text-[#666666]">{plan.researchResult.school.toUpperCase()}</p> : null}
            </div>

            <div className="border border-black bg-white p-4">
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#666666]">AMMO</p>
              <p className="mt-3 text-black">{(plan.excuse || 'EXCUSE PENDING').toUpperCase()}</p>
              <p className="mt-2 text-[#666666]">
                {(plan.squad.length ? `${plan.squad.length} SQUAD MEMBERS LOCKED` : 'SQUAD ROSTER PENDING').toUpperCase()}
              </p>
              <p className="mt-2 text-[#666666]">{`OUTRAGE LEVEL ${plan.outrageLevel}/10`}</p>
            </div>

            <div className="border border-black bg-white p-4">
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#666666]">PIPELINE</p>
              <div className="mt-4 space-y-3">
                {progressLabels.map((label, index) => {
                  const activeIndex =
                    phase === 'complete' ? 3 : phase === 'generating' ? 2 : plan.targetResearched ? 1 : plan.targetName ? 0 : -1;
                  return (
                    <div key={label} className="flex items-center justify-between gap-3">
                      <span className="text-[11px] uppercase tracking-[0.22em] text-black">{label.toUpperCase()}</span>
                      <span className={index <= activeIndex ? 'text-[#39FF14]' : 'text-[#666666]'}>{makeAsciiBar(activeIndex, index)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {plan.researchResult ? (
              <div className="border border-[#39FF14] bg-white p-4">
                <p className="text-[11px] uppercase tracking-[0.34em] text-[#666666]">RESEARCH SUMMARY</p>
                <p className="mt-3 text-black">{plan.researchResult.summary}</p>
              </div>
            ) : null}

            {resultUrl ? (
              <a
                href={resultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-[#39FF14] bg-white p-4 transition hover:border-black"
              >
                <p className="text-[11px] uppercase tracking-[0.34em] text-[#666666]">DEPLOYED URL</p>
                <p className="mt-3 break-all text-[#39FF14]">{resultUrl}</p>
              </a>
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}
