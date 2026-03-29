type PhoneMockupProps = {
  name: string;
  headline: string;
  venue: string;
  time: string;
  squad: string[];
  excuse: string;
  theme: 'red' | 'gold' | 'green' | 'pink' | 'newspaper' | 'classified';
  compact?: boolean;
};

const themes = {
  red: { bg: '#0a0a0a', accent: '#e63946', text: '#ffffff', muted: '#888888' },
  gold: { bg: '#0a0e1a', accent: '#f4a261', text: '#ffffff', muted: '#667799' },
  green: { bg: '#000000', accent: '#39FF14', text: '#ffffff', muted: '#666666' },
  pink: { bg: '#0a0a12', accent: '#ff2d78', text: '#ffffff', muted: '#8888aa' },
  newspaper: { bg: '#f5f0e8', accent: '#cc0000', text: '#111111', muted: '#666666' },
  classified: { bg: '#e8dcc8', accent: '#8b0000', text: '#1a1a1a', muted: '#555555' },
};

export function PhoneMockup({ name, headline, venue, time, squad, excuse, theme, compact = false }: PhoneMockupProps) {
  const t = themes[theme];
  const badgeColor = theme === 'newspaper' || theme === 'classified' ? '#fff' : t.bg;

  if (compact) {
    // Simplified version for gallery: just headline, bar, countdown, CTA
    return (
      <div className="relative" style={{ containerType: 'inline-size' }}>
        <div className="relative overflow-hidden rounded-[12cqi] border-[2.5cqi] border-black/85 shadow-[0_16px_50px_rgba(0,0,0,0.12)]">
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-b-[4cqi]" style={{ background: 'black', height: '4cqi', width: '28cqi' }} />
          <div className="aspect-[9/17] overflow-hidden text-left" style={{ background: t.bg, padding: '6cqi', paddingTop: '10cqi' }}>

            {/* Badge */}
            <div style={{ background: t.accent, color: badgeColor, fontSize: '4cqi', padding: '1.5cqi 4cqi', marginBottom: '5cqi', display: 'inline-block', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, borderRadius: '1.5cqi' }}>
              INTERVENTION
            </div>

            {/* Headline — BIG */}
            <div style={{ color: t.text, fontSize: '9cqi', fontWeight: 900, lineHeight: 1.05, textTransform: 'uppercase' as const, letterSpacing: '-0.02em' }}>
              {headline}
            </div>

            {/* Venue */}
            <div style={{ color: t.muted, fontSize: '4cqi', marginTop: '4cqi', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
              {venue}
            </div>

            {/* FOMO bar */}
            <div style={{ marginTop: '6cqi' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '3.5cqi', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
                <span style={{ color: t.muted }}>FOMO</span>
                <span style={{ color: t.accent, fontWeight: 700 }}>94%</span>
              </div>
              <div style={{ marginTop: '2cqi', height: '3cqi', width: '100%', borderRadius: '99px', background: `${t.muted}33` }}>
                <div style={{ height: '100%', width: '94%', borderRadius: '99px', background: t.accent }} />
              </div>
            </div>

            {/* Countdown — BIG */}
            <div style={{ marginTop: '6cqi', textAlign: 'center' as const }}>
              <div style={{ color: t.text, fontSize: '12cqi', fontWeight: 800, letterSpacing: '-0.02em' }}>04:22</div>
              <div style={{ color: t.muted, fontSize: '3.5cqi', textTransform: 'uppercase' as const, marginTop: '1cqi' }}>REMAINING</div>
            </div>

            {/* Excuse one-liner */}
            <div style={{ marginTop: '5cqi', textAlign: 'center' as const }}>
              <span style={{ color: t.text, fontSize: '4.5cqi' }}>&quot;{excuse}&quot;</span>
              <span style={{ color: t.accent, fontSize: '4.5cqi', fontWeight: 800, marginLeft: '2cqi' }}>DENIED</span>
            </div>

            {/* CTA */}
            <div style={{ marginTop: '5cqi', background: t.accent, color: badgeColor, borderRadius: '2cqi', padding: '3cqi', textAlign: 'center' as const, fontSize: '4cqi', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
              I&apos;LL BE THERE
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full version for the hero phone
  return (
    <div className="relative" style={{ containerType: 'inline-size' }}>
      <div className="relative overflow-hidden rounded-[12cqi] border-[2.5cqi] border-black/85 shadow-[0_16px_50px_rgba(0,0,0,0.12)]">
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-b-[4cqi]" style={{ background: 'black', height: '4cqi', width: '28cqi' }} />

        <div className="aspect-[9/17] overflow-hidden text-left" style={{ background: t.bg, padding: '6cqi', paddingTop: '10cqi' }}>
          {/* Badge */}
          <div style={{ background: t.accent, color: badgeColor, fontSize: '3cqi', padding: '1cqi 3cqi', marginBottom: '4cqi', display: 'inline-block', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, borderRadius: '1cqi' }}>
            FORMAL INTERVENTION
          </div>

          {/* Headline */}
          <div style={{ color: t.text, fontSize: '6.5cqi', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase' as const, letterSpacing: '-0.02em' }}>
            {headline}
          </div>

          {/* Venue */}
          <div style={{ color: t.muted, fontSize: '3.2cqi', marginTop: '2.5cqi', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
            {venue} / {time}
          </div>

          {/* FOMO bar */}
          <div style={{ marginTop: '4cqi' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2.8cqi', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
              <span style={{ color: t.muted }}>FOMO LEVEL</span>
              <span style={{ color: t.accent, fontWeight: 700 }}>94%</span>
            </div>
            <div style={{ marginTop: '1.5cqi', height: '2cqi', width: '100%', borderRadius: '99px', background: `${t.muted}33` }}>
              <div style={{ height: '100%', width: '94%', borderRadius: '99px', background: t.accent }} />
            </div>
          </div>

          {/* Excuse */}
          <div style={{ marginTop: '4cqi', border: `1px solid ${t.accent}55`, borderRadius: '1.5cqi', padding: '3cqi' }}>
            <div style={{ color: t.muted, fontSize: '2.8cqi', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>EXCUSE SUBMITTED</div>
            <div style={{ color: t.text, fontSize: '4cqi', marginTop: '1.5cqi' }}>&quot;{excuse}&quot;</div>
            <div style={{ color: t.accent, fontSize: '3.5cqi', fontWeight: 800, marginTop: '1.5cqi', textTransform: 'uppercase' as const }}>REJECTED</div>
          </div>

          {/* Squad */}
          <div style={{ marginTop: '4cqi' }}>
            <div style={{ color: t.muted, fontSize: '2.8cqi', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>SQUAD ROSTER</div>
            <div style={{ marginTop: '2cqi' }}>
              {squad.map((s) => (
                <div key={s} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '3.2cqi', padding: '1cqi 0' }}>
                  <span style={{ color: t.text, textTransform: 'uppercase' as const }}>{s}</span>
                  <span style={{ color: t.accent, fontWeight: 700 }}>CONFIRMED</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '3.2cqi', padding: '1.5cqi 0 0', borderTop: `1px solid ${t.muted}33` }}>
                <span style={{ color: t.text, textTransform: 'uppercase' as const }}>{name}</span>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>PENDING</span>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div style={{ marginTop: '4cqi', border: `1px solid ${t.accent}66`, borderRadius: '1.5cqi', padding: '3cqi', textAlign: 'center' as const }}>
            <div style={{ color: t.muted, fontSize: '2.8cqi', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>TIME REMAINING</div>
            <div style={{ color: t.text, fontSize: '8cqi', fontWeight: 800, marginTop: '1cqi', letterSpacing: '-0.02em' }}>04:22:07</div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: '4cqi', background: t.accent, color: badgeColor, borderRadius: '1.5cqi', padding: '2.5cqi', textAlign: 'center' as const, fontSize: '3.2cqi', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>
            I&apos;LL BE THERE
          </div>
        </div>
      </div>
    </div>
  );
}
