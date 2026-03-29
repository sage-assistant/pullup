import Link from 'next/link';

import { Counter } from '@/components/counter';

const previewCards = [
  {
    label: 'Executive Intervention',
    title: 'Get Jordan to Gold Bar',
    copy: 'Boardroom language. Friend-level guilt. Timeline-based emotional damage.',
  },
  {
    label: 'Campus Recovery Plan',
    title: 'Stop Maya From Studying Tonight',
    copy: 'Library alibi dismantled with receipts, countdowns, and witness statements.',
  },
  {
    label: 'Birthday Emergency',
    title: 'Owen Is Not Escaping This',
    copy: 'FOMO heat map, petition signatures, and one ruthless excuse destroyer.',
  },
];

const metrics = [
  { value: 47, suffix: '', label: 'friends dragged outside tonight' },
  { value: 93, suffix: '%', label: 'reported guilt compliance rate' },
  { value: 6, suffix: 'm', label: 'average time to deploy a site' },
];

export function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-24 pt-8 sm:px-8 lg:px-12">
        <nav className="glass-surface sticky top-4 z-20 flex items-center justify-between rounded-full px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-[var(--accent-pink)] shadow-[0_0_24px_var(--accent-pink)]" />
            <span className="font-mono text-xs uppercase tracking-[0.32em] text-white/70">PULLUP</span>
          </div>
          <div className="hidden items-center gap-6 text-sm text-white/60 md:flex">
            <span>Oracle chat</span>
            <span>Live previews</span>
            <span>Instant deploys</span>
          </div>
          <Link href="/create" className="rounded-full border border-white/12 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/6">
            Build a Guilt Trip
          </Link>
        </nav>

        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(255,45,120,0.26),transparent_34%),radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_35%_30%,rgba(139,92,246,0.2),transparent_30%)]" />

        <div className="grid flex-1 items-center gap-16 py-18 lg:grid-cols-[1.12fr_0.88fr] lg:py-24">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-mono uppercase tracking-[0.28em] text-white/72">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-cyan)]" />
              nightlife conversion engine
            </div>
            <div className="space-y-6">
              <h1 className="max-w-4xl font-serif text-5xl leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl lg:text-8xl">
                Your friend is bailing.
                <br />
                <span className="hero-gradient-text">We can fix that.</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
                PULLUP turns tonight&apos;s social emergency into a bespoke AI-generated guilt trip website. The Oracle interviews you, researches the target, and ships an experience too specific to ignore.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/create" className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent-pink),var(--accent-purple),var(--accent-blue))] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(255,45,120,0.24)] transition hover:translate-y-[-1px]">
                Build a Guilt Trip
              </Link>
              <a href="#previews" className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3.5 text-sm font-semibold text-white/82 transition hover:border-white/28 hover:bg-white/6">
                See Example Sites
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="glass-surface rounded-3xl p-5">
                  <div className="text-3xl font-semibold tracking-[-0.04em] text-white">
                    <Counter value={metric.value} suffix={metric.suffix} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/56">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="glass-panel overflow-hidden rounded-[2rem] p-5">
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/48">Live Build Preview</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Campaign: Save Theo From The Couch</h2>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/8 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-300">
                  deploying
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <div className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-white/45">Oracle Verdict</p>
                      <p className="mt-2 text-lg font-medium text-white">Excuse probability collapse</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-semibold text-white">98%</p>
                      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/42">inevitable turnout</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/6">
                    <div className="h-full w-[88%] rounded-full bg-[linear-gradient(90deg,var(--accent-pink),var(--accent-blue))]" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-white/45">Excuse Destroyer</p>
                    <p className="mt-3 text-sm leading-6 text-white/70">
                      &quot;I&apos;m tired&quot; downgraded to a weak market signal after reviewing lunch espresso activity, Instagram likes, and available Uber inventory.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-white/45">Countdown</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">02:14:18</p>
                    <p className="mt-1 text-sm leading-6 text-white/56">until the venue closes and Theo starts lying about next weekend</p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-white/45">Squad Roster</p>
                      <p className="mt-2 text-white">Mina, Jules, Priya, Ben are already dressed and judging</p>
                    </div>
                    <div className="flex -space-x-3">
                      {['M', 'J', 'P', 'B'].map((initial) => (
                        <div key={initial} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(135deg,rgba(255,45,120,0.25),rgba(59,130,246,0.3))] font-mono text-sm text-white">
                          {initial}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-8 top-12 hidden w-56 rounded-[1.75rem] border border-white/10 bg-[rgba(10,10,15,0.8)] p-4 shadow-2xl shadow-black/35 backdrop-blur md:block">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/44">Research card</p>
              <h3 className="mt-3 text-base font-semibold text-white">Theo Chen</h3>
              <p className="mt-1 text-sm text-white/56">Product designer, Parsons alum, publicly obsessed with rooftop bars and saying he&apos;s &quot;staying in&quot; right before he caves.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="previews" className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--accent-pink)]">Example payloads</p>
            <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em] text-white sm:text-5xl">Sites that feel personally unreasonable</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/58">
            Every generated page is a full self-contained interactive site with a splash screen, personalized roasts, competing timelines, countdowns, petitions, and enough bespoke detail to make the target feel professionally cornered.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {previewCards.map((card, index) => (
            <article key={card.title} className="glass-panel rounded-[2rem] p-5 transition hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/42">{card.label}</span>
                <span className="text-sm text-white/30">0{index + 1}</span>
              </div>
              <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(255,45,120,0.24),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5">
                <div className="rounded-[1.25rem] border border-white/10 bg-[#0b0b12] p-4">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-2 w-20 rounded-full bg-white/10" />
                      <div className="h-2 w-28 rounded-full bg-white/6" />
                    </div>
                    <div className="h-9 w-9 rounded-full border border-white/10 bg-white/6" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-26 rounded-[1.25rem] bg-[linear-gradient(135deg,rgba(255,45,120,0.18),rgba(59,130,246,0.16))]" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-18 rounded-[1rem] bg-white/5" />
                      <div className="h-18 rounded-[1rem] bg-white/5" />
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-30 sm:px-8 lg:px-12">
        <div className="glass-panel overflow-hidden rounded-[2.2rem] p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--accent-cyan)]">How it works</p>
              <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em] text-white">One snarky interview. One devastating website.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                'Tell the Oracle what is happening tonight, where, and when.',
                'Name the friend who is trying to disappear so research can start.',
                'Review the deployed site and send a link they absolutely should not ignore.',
              ].map((item, index) => (
                <div key={item} className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/38">step 0{index + 1}</div>
                  <p className="mt-4 text-sm leading-7 text-white/66">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-white/8 pt-8 md:flex-row md:items-center">
            <p className="max-w-2xl text-base leading-7 text-white/56">
              The Oracle stays funny, rude, and mission-focused. The final website ships as a complete HTML experience with no extra hosting setup and no database drag.
            </p>
            <Link href="/create" className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/28 hover:bg-white/8">
              Start the Interrogation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
