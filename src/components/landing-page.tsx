'use client';

import Image from 'next/image';
import Link from 'next/link';

const gallery = [
  { img: '/mobile-marcus.jpg', name: 'marcus', event: 'rooftop bar, nyc', result: 'showed up at 11:42pm' },
  { img: '/mobile-sophie.jpg', name: 'sophie', event: 'birthday dinner, la', result: 'confirmed in 8 minutes' },
  { img: '/mobile-jake.jpg', name: 'jake', event: 'concert, chicago', result: 'caved after section 3' },
  { img: '/mobile-priya.jpg', name: 'priya', event: 'house party, toronto', result: 'arrived with snacks' },
  { img: '/mobile-tyler.jpg', name: 'tyler', event: 'game night, austin', result: 'texted "fine" in all caps' },
  { img: '/mobile-emma.jpg', name: 'emma', event: 'brunch, miami', result: 'ordered uber mid-scroll' },
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <span className="text-[15px] font-semibold tracking-tight text-black">pullup</span>
          <Link
            href="/create"
            className="rounded-full bg-[#39FF14] px-5 py-2.5 text-[13px] font-semibold text-black transition hover:brightness-90"
          >
            make one
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-5xl px-5 pb-16 pt-8 sm:pb-20 sm:pt-12">
        <div className="flex flex-col items-center text-center">

          {/* Giant phone */}
          <div className="relative mx-auto w-[260px] sm:w-[280px] lg:w-[300px]">
            <div className="relative aspect-[9/16.5] overflow-hidden rounded-[2rem] border-[3px] border-black/90 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
              <Image
                src="/mobile-jake.jpg"
                alt="Example generated site"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Notch */}
            <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
          </div>

          {/* Story */}
          <p className="mt-8 max-w-sm text-[17px] leading-relaxed text-black/70 sm:mt-10 sm:text-[19px]">
            jake said he was tired. so his friends built him a website about it.
          </p>

          {/* CTA */}
          <Link
            href="/create"
            className="mt-6 inline-block rounded-full bg-[#39FF14] px-8 py-3.5 text-[15px] font-semibold text-black transition hover:brightness-90 sm:mt-8"
          >
            make one for your friend
          </Link>

          {/* Tiny proof */}
          <p className="mt-5 text-[13px] text-black/35">93% of targets showed up</p>
        </div>
      </section>

      {/* GALLERY — Desktop: horizontal tilted phones. Mobile: vertical story cards */}
      <section className="border-t border-black/8 bg-[#fafaf9] py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5">
          <p className="mb-8 text-center text-[13px] text-black/40 sm:mb-12">recent builds</p>

          {/* Desktop: tilted phone row */}
          <div className="hidden justify-center gap-6 sm:flex lg:gap-8">
            {gallery.map((card, i) => (
              <div
                key={card.name}
                className="w-[150px] flex-shrink-0 transition-transform duration-500 hover:scale-105 lg:w-[165px]"
                style={{
                  transform: `rotate(${['-4', '-1', '2', '-2', '3', '-3'][i]}deg)`,
                  marginTop: i % 2 === 0 ? '0px' : '20px',
                }}
              >
                <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border-2 border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                  <Image src={card.img} alt={card.name} fill className="object-cover" />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-[13px] font-medium text-black">{card.name}</p>
                  <p className="text-[12px] text-black/40">{card.event}</p>
                  <p className="mt-1 text-[12px] font-medium text-[#22c55e]">{card.result}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: vertical story cards */}
          <div className="space-y-6 sm:hidden">
            {gallery.map((card) => (
              <div key={card.name} className="flex gap-4">
                <div className="relative w-[100px] flex-shrink-0">
                  <div className="relative aspect-[9/16] overflow-hidden rounded-xl border border-black/10 shadow-sm">
                    <Image src={card.img} alt={card.name} fill className="object-cover" />
                  </div>
                </div>
                <div className="flex flex-col justify-center py-1">
                  <p className="text-[15px] font-medium text-black">{card.name}</p>
                  <p className="mt-0.5 text-[13px] text-black/45">{card.event}</p>
                  <p className="mt-2 text-[13px] font-medium text-[#22c55e]">{card.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-md px-5 text-center">
          <p className="text-[22px] font-semibold leading-snug text-black sm:text-[26px]">
            stop asking nicely.
          </p>
          <p className="mt-3 text-[15px] text-black/50">
            build a website so specific they can&apos;t ignore it.
          </p>
          <Link
            href="/create"
            className="mt-8 inline-block rounded-full bg-[#39FF14] px-8 py-3.5 text-[15px] font-semibold text-black transition hover:brightness-90"
          >
            start building
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/8 py-6 text-center">
        <p className="text-[12px] text-black/30">pullup 2026</p>
      </footer>
    </main>
  );
}
