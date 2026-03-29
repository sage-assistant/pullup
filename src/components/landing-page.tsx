import Image from 'next/image';
import Link from 'next/link';

import { Counter } from '@/components/counter';

const phones = [
  { img: '/mobile-marcus.jpg', name: 'MARCUS R.', theme: 'THREAT LEVEL', rotate: '-6deg', z: 1 },
  { img: '/mobile-sophie.jpg', name: 'SOPHIE L.', theme: 'FORMAL SUMMONS', rotate: '-2deg', z: 2 },
  { img: '/mobile-jake.jpg', name: 'JAKE M.', theme: 'TERMINAL BREACH', rotate: '2deg', z: 3 },
  { img: '/mobile-priya.jpg', name: 'PRIYA S.', theme: 'CAMPAIGN BRIEF', rotate: '-1deg', z: 4 },
  { img: '/mobile-tyler.jpg', name: 'TYLER K.', theme: 'BREAKING NEWS', rotate: '4deg', z: 2 },
  { img: '/mobile-emma.jpg', name: 'EMMA C.', theme: 'CLASSIFIED', rotate: '-3deg', z: 1 },
];

const metrics = [
  { value: 47, suffix: '', label: 'DEPLOYED TONIGHT' },
  { value: 93, suffix: '%', label: 'COMPLIANCE RATE' },
  { value: 6, suffix: 'M', label: 'AVG BUILD TIME' },
];

const gallery = [
  { img: '/mobile-marcus.jpg', name: 'MARCUS R.', event: 'ROOFTOP BAR, NYC', theme: 'THREAT LEVEL RED', result: 'SHOWED UP AT 11:42 PM' },
  { img: '/mobile-sophie.jpg', name: 'SOPHIE L.', event: 'BIRTHDAY DINNER, LA', theme: 'FORMAL SUMMONS', result: 'CONFIRMED IN 8 MINUTES' },
  { img: '/mobile-jake.jpg', name: 'JAKE M.', event: 'CONCERT, CHICAGO', theme: 'TERMINAL BREACH', result: 'CAVED AFTER READING SECTION 3' },
  { img: '/mobile-priya.jpg', name: 'PRIYA S.', event: 'HOUSE PARTY, TORONTO', theme: 'CAMPAIGN BRIEF', result: 'ARRIVED WITH SNACKS AS PENANCE' },
  { img: '/mobile-tyler.jpg', name: 'TYLER K.', event: 'GAME NIGHT, AUSTIN', theme: 'BREAKING NEWS', result: 'TEXTED "FINE" IN ALL CAPS' },
  { img: '/mobile-emma.jpg', name: 'EMMA C.', event: 'BRUNCH, MIAMI', theme: 'CLASSIFIED FILE', result: 'ORDERED THE UBER MID-SCROLL' },
];

export function LandingPage() {
  return (
    <main className="bg-white text-black overflow-x-hidden">

      {/* NAV */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#e0e0e0] px-5 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.35em]">PULLUP</Link>
        <div className="flex items-center gap-6">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[#666666] sm:block">
            <Counter value={47} suffix="" /> FRIENDS CONVINCED TONIGHT
          </span>
          <Link
            href="/create"
            className="border border-black bg-[#39FF14] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.32em] transition hover:border-[#39FF14]"
          >
            START
          </Link>
        </div>
      </nav>

      {/* HERO: PHONE WALL */}
      <section className="relative py-16 sm:py-20 lg:py-28">
        {/* Phone carousel */}
        <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-4 px-5 sm:gap-6 lg:gap-8">
          {phones.map((phone, i) => (
            <div
              key={phone.name}
              className="relative flex-shrink-0 w-[140px] sm:w-[170px] lg:w-[200px] transition-transform duration-500 hover:scale-105"
              style={{
                transform: `rotate(${phone.rotate})`,
                zIndex: phone.z,
                marginTop: i % 2 === 0 ? '0px' : '30px',
              }}
            >
              <div className="relative aspect-[9/16] overflow-hidden border-2 border-black bg-black">
                <Image src={phone.img} alt={phone.name} fill className="object-cover" priority={i < 3} />
              </div>
              <p className="mt-2 text-center font-mono text-[8px] uppercase tracking-[0.3em] text-[#666666]">{phone.theme}</p>
            </div>
          ))}
        </div>

        {/* Text overlay below phones */}
        <div className="mx-auto mt-12 max-w-2xl text-center px-5 sm:mt-16">
          <h1 className="font-sans text-5xl font-black uppercase tracking-[-0.06em] sm:text-7xl lg:text-8xl">
            PULL UP.
          </h1>
          <p className="mx-auto mt-4 max-w-md font-mono text-sm leading-7 text-[#666666]">
            AI BUILDS A PERSONALIZED WEBSITE TO GUILT YOUR FRIEND INTO SHOWING UP. TAKES 6 MINUTES.
          </p>
          <div className="mt-8">
            <Link
              href="/create"
              className="border border-black bg-[#39FF14] px-8 py-4 font-mono text-[11px] uppercase tracking-[0.34em] transition hover:border-[#39FF14]"
            >
              BUILD A GUILT TRIP
            </Link>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
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

      {/* HOW IT WORKS: 3 steps, tight */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="grid gap-px border border-black bg-black md:grid-cols-3">
          {[
            { num: '01', title: 'DESCRIBE', text: 'TELL THE ORACLE WHERE, WHEN, AND WHO.' },
            { num: '02', title: 'RESEARCH', text: 'AI FINDS THEIR JOB, SCHOOL, AND HISTORY.' },
            { num: '03', title: 'DEPLOY', text: 'SEND THE LINK. WATCH THEM CAVE.' },
          ].map((step) => (
            <div key={step.num} className="bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="border border-black bg-[#39FF14] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3em]">{step.num}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]">{step.title}</span>
              </div>
              <p className="mt-4 font-mono text-sm leading-7 text-[#666666]">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="border-t border-black pt-10">
          <div className="flex items-end justify-between mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#666666]">RECENT DEPLOYMENTS</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#666666]">EVERY SITE WORKED.</p>
          </div>

          <div className="grid gap-px border border-black bg-black sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((card) => (
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
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-black">{card.result}</p>
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
