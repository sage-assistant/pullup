import Link from 'next/link';

import { Counter } from '@/components/counter';

const previewCards = [
  {
    label: 'EXECUTIVE INTERVENTION',
    title: 'GET JORDAN TO GOLD BAR',
    copy: 'Boardroom language. Friend-level pressure. A clean case for leaving the apartment.',
  },
  {
    label: 'CAMPUS RECOVERY PLAN',
    title: 'STOP MAYA FROM STUDYING TONIGHT',
    copy: 'The library alibi gets dismantled with specifics, witnesses, and a hard deadline.',
  },
  {
    label: 'BIRTHDAY EMERGENCY',
    title: 'OWEN IS NOT ESCAPING THIS',
    copy: 'A direct escalation path from weak excuse to immediate social compliance.',
  },
];

const metrics = [
  { value: 47, suffix: '', label: 'FRIENDS DRAGGED OUTSIDE TONIGHT' },
  { value: 93, suffix: '%', label: 'REPORTED COMPLIANCE RATE' },
  { value: 6, suffix: 'M', label: 'AVERAGE TIME TO DEPLOY' },
];

const steps = [
  'TELL THE ORACLE WHERE TONIGHT IS HAPPENING, WHEN IT STARTS, AND WHAT IS AT STAKE.',
  'NAME THE FRIEND WHO IS TRYING TO DISAPPEAR SO THE RESEARCH PASS CAN START.',
  'SEND THE DEPLOYED PAGE THE SECOND THE CASE IS READY.',
];

export function LandingPage() {
  return (
    <main className="bg-white text-black">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl grid-rows-[auto_1fr_auto] px-5 py-5 sm:px-8 sm:py-6 lg:px-10">
        <nav className="grid gap-4 border border-black p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
          <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.35em]">
            PULLUP
          </Link>
          <div className="hidden justify-center gap-8 font-mono text-[11px] uppercase tracking-[0.3em] text-[#666666] md:flex">
            <span>ORACLE CHAT</span>
            <span>LIVE PREVIEWS</span>
            <span>INSTANT DEPLOYS</span>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center justify-center border border-black bg-[#39FF14] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.32em] transition hover:border-[#39FF14]"
          >
            START ORACLE SESSION
          </Link>
        </nav>

        <div className="grid items-end py-12 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:py-20">
          <div>
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.38em] text-[#666666]">SWISS TERMINAL MINIMAL</p>
            <h1 className="max-w-5xl font-sans text-[4rem] leading-[0.88] font-black uppercase tracking-[-0.08em] sm:text-[6rem] lg:text-[8.6rem]">
              YOUR FRIEND
              <br />
              IS BAILING.
            </h1>
            <p className="mt-6 max-w-2xl font-mono text-sm leading-7 text-[#666666] sm:text-base">
              PULLUP RUNS AN ORACLE SESSION, RESEARCHES THE TARGET, AND DEPLOYS A CLEAN PERSONALIZED WEBSITE DESIGNED TO END THE EXCUSE CYCLE.
            </p>
            <div className="mt-8">
              <Link
                href="/create"
                className="inline-flex items-center justify-center border border-black bg-[#39FF14] px-6 py-4 font-mono text-[11px] uppercase tracking-[0.34em] transition hover:border-[#39FF14]"
              >
                START ORACLE SESSION
              </Link>
            </div>
          </div>

          <div className="mt-12 border border-black bg-[#f8f8f8] p-5 lg:mt-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#666666]">EXAMPLE OUTPUT</p>
            <div className="mt-6 space-y-4 font-mono text-sm leading-7">
              <div className="border border-black p-4">
                <p className="uppercase tracking-[0.28em] text-[#666666]">VERDICT</p>
                <p className="mt-3 text-black">TARGET EXCUSE IS COLLAPSING UNDER PUBLIC SCRUTINY.</p>
              </div>
              <div className="border border-black p-4">
                <p className="uppercase tracking-[0.28em] text-[#666666]">WINDOW</p>
                <p className="mt-3 text-black">02:14:18 UNTIL THE VENUE CLOSES AND THE STORY CHANGES.</p>
              </div>
              <div className="border border-[#39FF14] p-4">
                <p className="uppercase tracking-[0.28em] text-[#666666]">STATUS</p>
                <p className="mt-3 text-black">SITE READY TO DEPLOY. SOCIAL PRESSURE INCREASING.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-px border border-black bg-black sm:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-white p-5">
              <div className="font-mono text-4xl font-bold uppercase tracking-[-0.06em] text-black">
                <Counter value={metric.value} suffix={metric.suffix} />
              </div>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#666666]">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-20">
        <div className="grid gap-8 border-t border-black pt-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#666666]">HOW IT WORKS</p>
            <h2 className="mt-4 max-w-xl font-sans text-4xl font-black uppercase tracking-[-0.06em] sm:text-5xl">
              ONE SESSION. ONE CASE. ONE LINK.
            </h2>
          </div>
          <div className="grid gap-px border border-black bg-black md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="bg-white p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#666666]">STEP 0{index + 1}</p>
                <p className="mt-5 font-mono text-sm leading-7 text-black">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-24">
        <div className="flex flex-col gap-4 border-t border-black pt-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#666666]">EXAMPLE CARDS</p>
            <h2 className="mt-4 font-sans text-4xl font-black uppercase tracking-[-0.06em] sm:text-5xl">
              SPECIFIC ENOUGH TO LAND.
            </h2>
          </div>
          <p className="max-w-2xl font-mono text-sm leading-7 text-[#666666]">
            EACH GENERATED PAGE IS CLEAN, DIRECT, AND PERSONAL ENOUGH TO MAKE THE TARGET FEEL CORNERED BY THEIR OWN HISTORY.
          </p>
        </div>

        <div className="mt-8 grid gap-px border border-black bg-black lg:grid-cols-3">
          {previewCards.map((card, index) => (
            <article key={card.title} className="bg-white p-5">
              <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#666666]">{card.label}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-black">0{index + 1}</span>
              </div>
              <div className="mt-5 border border-black p-4">
                <div className="grid gap-3">
                  <div className="border border-[#e0e0e0] p-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[#666666]">
                    ORACLE OUTPUT
                  </div>
                  <div className="grid gap-px border border-black bg-black sm:grid-cols-2">
                    <div className="bg-[#f8f8f8] p-4 font-mono text-[11px] uppercase tracking-[0.28em] text-black">COUNTDOWN</div>
                    <div className="bg-[#f8f8f8] p-4 font-mono text-[11px] uppercase tracking-[0.28em] text-black">PETITION</div>
                  </div>
                </div>
              </div>
              <h3 className="mt-5 font-sans text-2xl font-black uppercase tracking-[-0.05em] text-black">{card.title}</h3>
              <p className="mt-3 font-mono text-sm leading-7 text-[#666666]">{card.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
