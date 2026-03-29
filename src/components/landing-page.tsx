'use client';

import Link from 'next/link';

import { PhoneMockup } from '@/components/phone-mockup';

const heroPhone = {
  name: 'jake',
  headline: 'Jake, the concert is tonight.',
  venue: 'Metro, Chicago',
  time: '4AM Last Call',
  squad: ['Mina K.', 'Jules R.', 'Priya S.'],
  excuse: "i'm tired",
  theme: 'green' as const,
};

const galleryPhones = [
  { name: 'marcus', headline: 'Marcus, the rooftop is waiting.', venue: 'Skybar, NYC', time: '2AM Close', squad: ['Dan', 'Libby', 'Paul'], excuse: "i have work tomorrow", theme: 'red' as const, event: 'rooftop bar, nyc', result: 'showed up at 11:42pm' },
  { name: 'sophie', headline: 'Sophie, this is not optional.', venue: 'Nobu, LA', time: '11PM Reservation', squad: ['Rachel', 'Tom', 'Ava'], excuse: "i already ate", theme: 'gold' as const, event: 'birthday dinner, la', result: 'confirmed in 8 minutes' },
  { name: 'jake', headline: 'Jake, the concert is tonight.', venue: 'Metro, Chicago', time: '4AM Last Call', squad: ['Mina', 'Jules', 'Priya'], excuse: "i'm tired", theme: 'green' as const, event: 'concert, chicago', result: 'caved after section 3' },
  { name: 'priya', headline: 'Priya, the squad needs you.', venue: 'Coda, Toronto', time: '4AM Last Call', squad: ['Adam', 'Dan', 'Libby'], excuse: "maybe next weekend", theme: 'pink' as const, event: 'house party, toronto', result: 'arrived with snacks' },
  { name: 'tyler', headline: 'Breaking: Tyler attempts to bail.', venue: 'Ben\'s Place, Austin', time: '10PM Start', squad: ['Chris', 'Sam', 'Nadia'], excuse: "i just got comfortable", theme: 'newspaper' as const, event: 'game night, austin', result: 'texted "fine" in all caps' },
  { name: 'emma', headline: 'Case #EM: Failure to attend brunch.', venue: 'Mandolin, Miami', time: '12PM Reservation', squad: ['Mia', 'Lena', 'Dani'], excuse: "it's too early", theme: 'classified' as const, event: 'brunch, miami', result: 'ordered uber mid-scroll' },
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

          {/* Giant phone — HTML rendered, crisp at every size */}
          <div className="w-[240px] sm:w-[270px] lg:w-[300px]">
            <PhoneMockup {...heroPhone} />
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

      {/* GALLERY */}
      <section className="border-t border-black/8 bg-[#fafaf9] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="mb-8 text-center text-[13px] text-black/40 sm:mb-12">recent builds</p>

          {/* Desktop: tilted phone row */}
          <div className="hidden justify-center gap-5 sm:flex lg:gap-7">
            {galleryPhones.map((card, i) => (
              <div
                key={card.name + card.theme}
                className="w-[140px] flex-shrink-0 transition-transform duration-500 hover:scale-105 lg:w-[155px]"
                style={{
                  transform: `rotate(${['-4', '-1', '2', '-2', '3', '-3'][i]}deg)`,
                  marginTop: i % 2 === 0 ? '0px' : '18px',
                }}
              >
                <PhoneMockup {...card} />
                <div className="mt-3 text-center">
                  <p className="text-[13px] font-medium text-black">{card.name}</p>
                  <p className="text-[12px] text-black/40">{card.event}</p>
                  <p className="mt-1 text-[12px] font-medium text-[#22c55e]">{card.result}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: horizontal scroll of medium phones */}
          <div
            className="flex gap-5 overflow-x-auto pb-4 sm:hidden"
            style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
          >
            {galleryPhones.map((card) => (
              <div key={card.name + card.theme} className="w-[160px] flex-shrink-0">
                <PhoneMockup {...card} />
                <div className="mt-3">
                  <p className="text-[13px] font-medium text-black">{card.name}</p>
                  <p className="text-[12px] text-black/40">{card.event}</p>
                  <p className="mt-1 text-[12px] font-medium text-[#22c55e]">{card.result}</p>
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
