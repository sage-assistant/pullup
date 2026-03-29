'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
  { img: '/mobile-jake.jpg', name: 'JAKE M.', event: 'CONCERT, CHICAGO', theme: 'TERMINAL BREACH', result: 'CAVED AFTER SECTION 3' },
  { img: '/mobile-priya.jpg', name: 'PRIYA S.', event: 'HOUSE PARTY, TORONTO', theme: 'CAMPAIGN BRIEF', result: 'ARRIVED WITH SNACKS' },
  { img: '/mobile-tyler.jpg', name: 'TYLER K.', event: 'GAME NIGHT, AUSTIN', theme: 'BREAKING NEWS', result: 'TEXTED "FINE" IN CAPS' },
  { img: '/mobile-emma.jpg', name: 'EMMA C.', event: 'BRUNCH, MIAMI', theme: 'CLASSIFIED FILE', result: 'UBER ORDERED MID-SCROLL' },
];

export function LandingPage() {
  const [showAll, setShowAll] = useState(false);
  const visibleGallery = showAll ? gallery : gallery.slice(0, 3);

  return (
    <main className="bg-white text-black overflow-x-hidden">

      {/* NAV — sticky */}
      <nav className="sticky top-0 z-50 border-b border-[#e0e0e0] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-10">
          <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.35em]">PULLUP</Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[#666666] md:block">
              <Counter value={47} suffix="" /> FRIENDS CONVINCED TONIGHT
            </span>
            <Link
              href="/create"
              className="border-2 border-black bg-[#39FF14] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.32em] transition hover:bg-black hover:text-[#39FF14]"
            >
              START
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative py-10 sm:py-16 lg:py-24">

        {/* Mobile: horizontal scroll, large phones */}
        <div
          className="flex gap-5 overflow-x-auto px-5 pb-2 sm:hidden"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
        >
          {phones.map((phone) => (
            <div key={phone.name} className="relative flex-shrink-0 w-[200px]">
              <div className="relative aspect-[9/16] overflow-hidden border-2 border-black">
                <Image src={phone.img} alt={phone.name} fill className="object-cover" priority />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-black">{phone.name}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#39FF14]">{phone.theme}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Scroll fade hint on mobile */}
        <div className="pointer-events-none absolute right-0 top-10 h-[340px] w-12 bg-gradient-to-l from-white to-transparent sm:hidden" />

        {/* Tablet: 3 phones in a row */}
        <div className="mx-auto hidden max-w-2xl items-center justify-center gap-5 px-8 sm:flex lg:hidden">
          {phones.slice(0, 3).map((phone, i) => (
            <div
              key={phone.name}
              className="relative w-[180px] transition-transform duration-500 hover:scale-105"
              style={{
                transform: `rotate(${phone.rotate})`,
                zIndex: phone.z,
                marginTop: i % 2 === 0 ? '0px' : '20px',
              }}
            >
              <div className="relative aspect-[9/16] overflow-hidden border-2 border-black">
                <Image src={phone.img} alt={phone.name} fill className="object-cover" priority />
              </div>
              <p className="mt-2 text-center font-mono text-[8px] uppercase tracking-[0.3em] text-[#666666]">{phone.theme}</p>
            </div>
          ))}
        </div>

        {/* Desktop: full fanned wall */}
        <div className="relative mx-auto hidden max-w-6xl items-center justify-center gap-6 px-8 lg:flex xl:gap-8">
          {phones.map((phone, i) => (
            <div
              key={phone.name}
              className="relative w-[190px] xl:w-[200px] transition-transform duration-500 hover:scale-105"
              style={{
                transform: `rotate(${phone.rotate})`,
                zIndex: phone.z,
                marginTop: i % 2 === 0 ? '0px' : '28px',
              }}
            >
              <div className="relative aspect-[9/16] overflow-hidden border-2 border-black">
                <Image src={phone.img} alt={phone.name} fill className="object-cover" priority={i < 3} />
              </div>
              <p className="mt-2 text-center font-mono text-[8px] uppercase tracking-[0.3em] text-[#666666]">{phone.theme}</p>
            </div>
          ))}
        </div>

        {/* Headline */}
        <div className="mx-auto mt-8 max-w-2xl text-center px-5 sm:mt-14">
          <h1 className="font-sans text-[3.5rem] leading-[0.88] font-black uppercase tracking-[-0.07em] sm:text-7xl lg:text-[5.5rem]">
            PULL UP.
          </h1>
          <p className="mx-auto mt-4 max-w-sm font-mono text-xs leading-6 text-[#666666] sm:max-w-md sm:text-sm sm:leading-7">
            AI BUILDS A PERSONALIZED GUILT TRIP WEBSITE. TAKES 6 MINUTES.
          </p>
          <div className="mt-6 sm:mt-8">
            <Link
              href="/create"
              className="inline-block border-2 border-black bg-[#39FF14] px-8 py-4 font-mono text-[11px] uppercase tracking-[0.34em] transition hover:bg-black hover:text-[#39FF14]"
            >
              BUILD A GUILT TRIP
            </Link>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8 sm:pb-14 lg:px-10">
        <div className="grid gap-px border border-black bg-black sm:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-white p-4 sm:p-5">
              <div className="font-mono text-3xl font-bold tracking-[-0.06em] text-black sm:text-4xl">
                <Counter value={metric.value} suffix={metric.suffix} />
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#666666]">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8 sm:pb-14 lg:px-10">
        <div className="grid gap-px border border-black bg-black md:grid-cols-3">
          {[
            { num: '01', title: 'DESCRIBE', text: 'TELL THE ORACLE WHERE, WHEN, AND WHO.' },
            { num: '02', title: 'RESEARCH', text: 'AI FINDS THEIR JOB, SCHOOL, AND HISTORY.' },
            { num: '03', title: 'DEPLOY', text: 'SEND THE LINK. WATCH THEM CAVE.' },
          ].map((step) => (
            <div key={step.num} className="bg-white p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="border border-black bg-[#39FF14] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3em]">{step.num}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]">{step.title}</span>
              </div>
              <p className="mt-3 font-mono text-xs leading-6 text-[#666666] sm:text-sm sm:leading-7">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY — 3 on mobile, expand to 6 */}
      <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8 sm:pb-14 lg:px-10">
        <div className="border-t border-black pt-8 sm:pt-10">
          <div className="flex items-end justify-between mb-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#666666]">RECENT DEPLOYMENTS</p>
          </div>

          <div className="grid gap-px border border-black bg-black grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {visibleGallery.map((card) => (
              <div key={card.name} className="group bg-white">
                <div className="relative aspect-[9/12] sm:aspect-[9/14] overflow-hidden">
                  <Image src={card.img} alt={card.name} fill className="object-cover object-top transition duration-500 group-hover:scale-105" />
                </div>
                <div className="border-t border-[#e0e0e0] p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-black">{card.name}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#39FF14]">{card.theme}</span>
                  </div>
                  <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#666666]">{card.event}</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-black">{card.result}</p>
                </div>
              </div>
            ))}
          </div>

          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-4 w-full border border-black p-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#666666] transition hover:bg-[#f8f8f8] sm:hidden"
            >
              SEE ALL 6 DEPLOYMENTS
            </button>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 sm:pb-20 lg:px-10">
        <div className="border-2 border-black p-8 text-center sm:p-14">
          <h2 className="font-sans text-3xl font-black uppercase tracking-[-0.06em] sm:text-5xl lg:text-6xl">
            STOP ASKING NICELY.
          </h2>
          <div className="mt-6 sm:mt-8">
            <Link
              href="/create"
              className="inline-block border-2 border-black bg-[#39FF14] px-6 py-4 font-mono text-[11px] uppercase tracking-[0.34em] transition hover:bg-black hover:text-[#39FF14] sm:px-8 sm:py-5 sm:text-[12px]"
            >
              START ORACLE SESSION
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e0e0e0] py-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#666666]">PULLUP 2026</p>
      </footer>
    </main>
  );
}
