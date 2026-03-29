type PhoneMockupProps = {
  name: string;
  headline: string;
  venue: string;
  time: string;
  squad: string[];
  excuse: string;
  theme: 'red' | 'gold' | 'green' | 'pink' | 'newspaper' | 'classified';
};

const themes = {
  red: { bg: '#0a0a0a', accent: '#e63946', text: '#ffffff', muted: '#888888' },
  gold: { bg: '#0a0e1a', accent: '#f4a261', text: '#ffffff', muted: '#667799' },
  green: { bg: '#000000', accent: '#39FF14', text: '#ffffff', muted: '#666666' },
  pink: { bg: '#0a0a12', accent: '#ff2d78', text: '#ffffff', muted: '#8888aa' },
  newspaper: { bg: '#f5f0e8', accent: '#cc0000', text: '#111111', muted: '#666666' },
  classified: { bg: '#e8dcc8', accent: '#8b0000', text: '#1a1a1a', muted: '#555555' },
};

export function PhoneMockup({ name, headline, venue, time, squad, excuse, theme }: PhoneMockupProps) {
  const t = themes[theme];

  return (
    <div className="relative">
      {/* Phone frame */}
      <div className="relative overflow-hidden rounded-[1.8rem] border-[3px] border-black/85 shadow-[0_16px_50px_rgba(0,0,0,0.12)]">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-10 h-5 w-16 -translate-x-1/2 rounded-b-xl" style={{ background: 'black' }} />

        {/* Screen content */}
        <div className="aspect-[9/16.5] overflow-hidden p-3 pt-7 text-left" style={{ background: t.bg }}>
          {/* Status badge */}
          <div
            className="mb-3 inline-block rounded-sm px-2 py-0.5 text-[6px] font-bold uppercase tracking-widest"
            style={{ background: t.accent, color: theme === 'newspaper' || theme === 'classified' ? '#fff' : t.bg }}
          >
            FORMAL INTERVENTION
          </div>

          {/* Headline */}
          <h3
            className="text-[11px] font-black uppercase leading-tight tracking-tight sm:text-[13px]"
            style={{ color: t.text }}
          >
            {headline}
          </h3>

          {/* Venue + time */}
          <p className="mt-1.5 text-[7px] uppercase tracking-wider" style={{ color: t.muted }}>
            {venue} / {time}
          </p>

          {/* Threat bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[6px] uppercase tracking-wider" style={{ color: t.muted }}>
              <span>FOMO LEVEL</span>
              <span style={{ color: t.accent }}>94%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full" style={{ background: `${t.muted}33` }}>
              <div className="h-full rounded-full" style={{ width: '94%', background: t.accent }} />
            </div>
          </div>

          {/* Excuse */}
          <div className="mt-3 rounded-sm border p-2" style={{ borderColor: `${t.accent}44` }}>
            <p className="text-[6px] uppercase tracking-wider" style={{ color: t.muted }}>EXCUSE SUBMITTED</p>
            <p className="mt-1 text-[8px]" style={{ color: t.text }}>&quot;{excuse}&quot;</p>
            <p className="mt-1 text-[7px] font-bold uppercase" style={{ color: t.accent }}>REJECTED</p>
          </div>

          {/* Squad */}
          <div className="mt-3">
            <p className="text-[6px] uppercase tracking-wider" style={{ color: t.muted }}>SQUAD ROSTER</p>
            <div className="mt-1.5 space-y-1">
              {squad.map((s) => (
                <div key={s} className="flex items-center justify-between text-[7px]">
                  <span style={{ color: t.text }}>{s.toUpperCase()}</span>
                  <span style={{ color: t.accent }}>CONFIRMED</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t pt-1 text-[7px]" style={{ borderColor: `${t.muted}33` }}>
                <span style={{ color: t.text }}>{name.toUpperCase()}</span>
                <span style={{ color: t.accent === '#e63946' ? '#e63946' : '#ef4444' }}>PENDING</span>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="mt-3 rounded-sm border p-2 text-center" style={{ borderColor: `${t.accent}66` }}>
            <p className="text-[6px] uppercase tracking-wider" style={{ color: t.muted }}>TIME REMAINING</p>
            <p className="mt-1 text-[14px] font-bold tracking-tight" style={{ color: t.text }}>
              04:22:07
            </p>
          </div>

          {/* CTA button */}
          <div
            className="mt-3 rounded-sm py-2 text-center text-[7px] font-bold uppercase tracking-widest"
            style={{ background: t.accent, color: theme === 'newspaper' || theme === 'classified' ? '#fff' : t.bg }}
          >
            I&apos;LL BE THERE
          </div>
        </div>
      </div>
    </div>
  );
}
