import Image from 'next/image';
import Link from 'next/link';

import { Counter } from '@/components/counter';

const metrics = [
  { value: 47, suffix: '', label: 'DEPLOYED TONIGHT' },
  { value: 93, suffix: '%', label: 'COMPLIANCE RATE' },
  { value: 6, suffix: 'M', label: 'AVG BUILD TIME' },
];

export function LandingPage() {
  return (
    <main className="bg-white text-black">
      {/* HERO */}
      <section className="mx-auto grid min-h-screen w-full max-w-7xl grid-rows-[auto_1fr_auto] px-5 py-5 sm:px-8 sm:py-6 lg:px-10">
        <nav className="flex items-center justify-between border border-black p-4">
          <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.35em]">
            PULLUP
          </Link>
          <Link
            href="/create"
            className="border border-black bg-[#39FF14] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.32em] transition hover:border-[#39FF14]"
          >
            START
          </Link>
        </nav>

        <div className="grid items-center py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:py-16">
          <div>
            <h1 className="font-sans text-[4.5rem] leading-[0.86] font-black uppercase tracking-[-0.08em] sm:text-[6.5rem] lg:text-[9rem]">
              YOUR
              <br />
              FRIEND
              <br />
              IS
              <br />
              <span className="text-[#39FF14]" style={{WebkitTextStroke: '2px black'}}>BAILING.</span>
            </h1>
            <div className="mt-8">
              <Link
                href="/create"
                className="border border-black bg-[#39FF14] px-6 py-4 font-mono text-[11px] uppercase tracking-[0.34em] transition hover:border-[#39FF14]"
              >
                BUILD A GUILT TRIP
              </Link>
            </div>
          </div>

          <div className="mt-10 lg:mt-0">
            <div className="relative aspect-[4/3] w-full border border-black">
              <Image src="/hero-empty-seat.jpg" alt="The empty seat" fill className="object-cover" priority />
              <div className="absolute bottom-0 left-0 right-0 border-t border-black bg-white/90 p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#666666]">THIS SEAT IS EMPTY BECAUSE YOUR FRIEND IS &quot;TIRED&quot;</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-px border border-black bg-black sm:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-white p-5">
              <div className="font-mono text-4xl font-bold tracking-[-0.06em] text-black">
                <Counter value={metric.value} suffix={metric.suffix} />
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#666666]">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS — visual */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="grid gap-px border border-black bg-black lg:grid-cols-3">
          <div className="relative bg-white">
            <div className="absolute left-4 top-4 z-10 border border-black bg-[#39FF14] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em]">
              01 DESCRIBE
            </div>
            <div className="relative aspect-square">
              <Image src="/hero-phone.jpg" alt="The text" fill className="object-cover" />
            </div>
            <p className="border-t border-[#e0e0e0] p-4 font-mono text-sm leading-7 text-black">
              Tell the Oracle where, when, and who.
            </p>
          </div>
          <div className="relative bg-white">
            <div className="absolute left-4 top-4 z-10 border border-black bg-[#39FF14] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em]">
              02 RESEARCH
            </div>
            <div className="relative aspect-square">
              <Image src="/hero-missing-hand.jpg" alt="The gap" fill className="object-cover" />
            </div>
            <p className="border-t border-[#e0e0e0] p-4 font-mono text-sm leading-7 text-black">
              AI finds their job, school, and public history.
            </p>
          </div>
          <div className="bg-white">
            <div className="flex aspect-square items-center justify-center border-b border-[#e0e0e0] bg-[#f8f8f8] p-8">
              <div className="w-full space-y-3 font-mono text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.22em]">RESEARCHING</span>
                  <span className="text-[#39FF14]">[========]</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.22em]">WRITING ROASTS</span>
                  <span className="text-[#39FF14]">[========]</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.22em]">BUILDING SITE</span>
                  <span className="text-[#39FF14]">[======--]</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.22em]">DEPLOYING</span>
                  <span className="text-[#666666]">[--------]</span>
                </div>
                <div className="mt-6 border border-[#39FF14] p-3 text-center text-[11px] uppercase tracking-[0.28em]">
                  SITE LIVE IN 6 MINUTES
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="border border-black bg-[#39FF14] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] inline-block mb-3">
                03 DEPLOY
              </div>
              <p className="font-mono text-sm leading-7 text-black">
                Send the link. Watch them cave.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY: REAL EXAMPLES */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="border-t border-black pt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#666666]">RECENT DEPLOYMENTS</p>
              <h2 className="mt-3 font-sans text-3xl font-black uppercase tracking-[-0.06em] sm:text-5xl">
                BUILT BY REAL PEOPLE.<br />SENT TO REAL FRIENDS.
              </h2>
            </div>
            <p className="max-w-sm font-mono text-[11px] leading-6 text-[#666666]">
              EVERY SITE IS UNIQUE. EVERY SITE WORKED.
            </p>
          </div>

          <div className="mt-8 grid gap-px border border-black bg-black sm:grid-cols-2 lg:grid-cols-3">
            {[
              { img: '/mobile-marcus.jpg', name: 'MARCUS R.', event: 'ROOFTOP BAR, NYC', theme: 'THREAT LEVEL RED', result: 'SHOWED UP AT 11:42 PM' },
              { img: '/mobile-sophie.jpg', name: 'SOPHIE L.', event: 'BIRTHDAY DINNER, LA', theme: 'FORMAL SUMMONS', result: 'CONFIRMED IN 8 MINUTES' },
              { img: '/mobile-jake.jpg', name: 'JAKE M.', event: 'CONCERT, CHICAGO', theme: 'TERMINAL BREACH', result: 'CAVED AFTER READING SECTION 3' },
              { img: '/mobile-priya.jpg', name: 'PRIYA S.', event: 'HOUSE PARTY, TORONTO', theme: 'CAMPAIGN BRIEF', result: 'ARRIVED WITH SNACKS AS PENANCE' },
              { img: '/mobile-tyler.jpg', name: 'TYLER K.', event: 'GAME NIGHT, AUSTIN', theme: 'BREAKING NEWS', result: 'TEXTED "FINE" IN ALL CAPS' },
              { img: '/mobile-emma.jpg', name: 'EMMA C.', event: 'BRUNCH, MIAMI', theme: 'CLASSIFIED FILE', result: 'ORDERED THE UBER MID-SCROLL' },
            ].map((card) => (
              <div key={card.name} className="group bg-white">
                <div className="relative aspect-[9/14] overflow-hidden">
                  <Image src={card.img} alt={card.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="border-t border-[#e0e0e0] p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-black">{card.name}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#39FF14]">{card.theme}</span>
                  </div>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#666666]">{card.event}</p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-black">{card.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        <div className="border border-black p-10 text-center sm:p-16">
          <h2 className="font-sans text-4xl font-black uppercase tracking-[-0.06em] sm:text-6xl">
            STOP ASKING NICELY.
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-mono text-sm leading-7 text-[#666666]">
            BUILD A WEBSITE SO SPECIFIC THEY CAN&apos;T IGNORE IT.
          </p>
          <div className="mt-8">
            <Link
              href="/create"
              className="border border-black bg-[#39FF14] px-8 py-5 font-mono text-[12px] uppercase tracking-[0.34em] transition hover:border-[#39FF14]"
            >
              START ORACLE SESSION
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
