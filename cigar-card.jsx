// CigarCard — shows a cigar as a "cigar in a band" visual row
// Relies on window.THEME, window.Icon

function StarRow({ value, size = 14, color }) {
  const c = color || THEME.gold;
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
          {Icon.star(false, 'rgba(100,80,60,0.25)', size)}
          <span style={{
            position: 'absolute', inset: 0, overflow: 'hidden',
            width: `${Math.max(0, Math.min(1, value - (i-1))) * 100}%`,
          }}>
            {Icon.star(true, c, size)}
          </span>
        </span>
      ))}
    </div>
  );
}

// Wrapper-shade presets keyed by name
const WRAPPER_SHADES = {
  'Connecticut':     { top: '#D9B482', mid: '#B88A55', btm: '#8A6336' },
  'Natural':         { top: '#B58450', mid: '#8A5C30', btm: '#5A3A1F' },
  'Habano':          { top: '#7E4A24', mid: '#5A331A', btm: '#3B1F0E' },
  'Corojo':          { top: '#8B4A22', mid: '#623015', btm: '#3E1C08' },
  'Maduro':          { top: '#4A2816', mid: '#2C1608', btm: '#180A02' },
  'Oscuro':          { top: '#2C1608', mid: '#180A02', btm: '#0A0400' },
  'Cameroon':        { top: '#9C6432', mid: '#6E421E', btm: '#3E220C' },
  'Candela':         { top: '#8FA062', mid: '#5E6E3C', btm: '#3D4824' },
};
function shadeFor(name) { return WRAPPER_SHADES[name] || WRAPPER_SHADES['Natural']; }

// SVG "cigar" illustration — body with cap + band. When lit: ash at foot, ember glow, smoke.
function CigarSvg({ band, foil, wrapperShade, lit = false, width = 320, height = 58 }) {
  const s = shadeFor(wrapperShade);
  const uid = `${band}-${foil}-${wrapperShade || 'n'}${lit ? '-lit' : ''}`.replace(/[^a-zA-Z0-9-]/g, '_');
  // Effective viewBox needs extra room above for smoke when lit
  const vbH = lit ? 120 : 58;
  const vbOffsetY = lit ? 62 : 0;
  const effH = lit ? Math.round(width * vbH / 320) : height;
  return (
    <svg width={width} height={effH} viewBox={`0 ${-vbOffsetY} 320 ${vbH}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`body-${uid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={s.top}/>
          <stop offset=".5" stopColor={s.mid}/>
          <stop offset="1" stopColor={s.btm}/>
        </linearGradient>
        <linearGradient id={`band-${uid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={band}/>
          <stop offset="1" stopColor={band} stopOpacity=".75"/>
        </linearGradient>
        {lit && (
          <>
            <radialGradient id={`ember-${uid}`} cx=".5" cy=".5" r=".5">
              <stop offset="0" stopColor="#FFE28A"/>
              <stop offset=".35" stopColor="#FF9A2E"/>
              <stop offset=".75" stopColor="#D93A0E"/>
              <stop offset="1" stopColor="#5A1608" stopOpacity=".9"/>
            </radialGradient>
            <linearGradient id={`ash-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#E8E0D3"/>
              <stop offset=".5" stopColor="#C9BFAE"/>
              <stop offset="1" stopColor="#867D6E"/>
            </linearGradient>
            <radialGradient id={`glow-${uid}`} cx=".5" cy=".5" r=".5">
              <stop offset="0" stopColor="#FF8A2E" stopOpacity=".55"/>
              <stop offset="1" stopColor="#FF8A2E" stopOpacity="0"/>
            </radialGradient>
            <filter id={`smokeBlur-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5"/>
            </filter>
          </>
        )}
      </defs>

      {lit && (
        <>
          {/* ambient glow around the foot (right side) */}
          <circle cx="298" cy="29" r="26" fill={`url(#glow-${uid})`}>
            <animate attributeName="r" values="22;28;24;27;22" dur="2.4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.7;1;0.75;0.95;0.7" dur="2.4s" repeatCount="indefinite"/>
          </circle>
          {/* smoke plumes — rising from the right foot */}
          <g filter={`url(#smokeBlur-${uid})`} opacity=".7">
            {[0, 0.7, 1.4, 2.1, 2.8].map((delay, i) => (
              <circle key={i} cx={298 + (i%2 === 0 ? -2 : 3)} cy="29" r="6" fill="rgba(220,220,220,0.9)">
                <animate attributeName="cy" from="22" to={`-${58 + i*3}`} dur="3.5s" begin={`${delay}s`} repeatCount="indefinite"/>
                <animate attributeName="cx"
                  values={`${296 + i};${292 + i};${300 - i};${294 + i};${290 + i}`}
                  dur="3.5s" begin={`${delay}s`} repeatCount="indefinite"/>
                <animate attributeName="r"
                  values="3;7;10;13;15"
                  dur="3.5s" begin={`${delay}s`} repeatCount="indefinite"/>
                <animate attributeName="opacity"
                  values="0;0.8;0.6;0.3;0"
                  dur="3.5s" begin={`${delay}s`} repeatCount="indefinite"/>
              </circle>
            ))}
          </g>
        </>
      )}

      {/* body — cap on LEFT, foot on RIGHT */}
      <path d={lit
        ? "M14 14 Q8 29 14 44 L272 44 Q278 29 272 14 Z"
        : "M14 14 Q8 29 14 44 L286 44 Q298 29 286 14 Z"}
        fill={`url(#body-${uid})`}/>
      {/* diagonal leaf lines */}
      {Array.from({length: 28}).map((_,i) => {
        const x1 = 18 + i*10;
        const x2 = 10 + i*10;
        if (lit && x1 > 272) return null;
        return <line key={i} x1={x1} y1="14" x2={x2} y2="44"
          stroke="rgba(0,0,0,0.12)" strokeWidth=".6"/>;
      })}
      {/* cap — LEFT */}
      <path d="M14 14 Q8 29 14 44" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1"/>
      <ellipse cx="10" cy="29" rx="4" ry="8" fill="rgba(0,0,0,0.2)"/>

      {lit ? (
        <>
          {/* ash at foot (right) — tapered cone */}
          <path d="M272 14 Q278 29 272 44 L286 44 Q294 29 286 14 Z" fill={`url(#ash-${uid})`}/>
          {/* ash crack lines */}
          <path d="M286 18 Q284 24 280 29 Q284 34 286 40" stroke="rgba(0,0,0,0.25)" strokeWidth=".4" fill="none"/>
          <path d="M280 16 Q282 29 280 42" stroke="rgba(255,255,255,0.35)" strokeWidth=".3" fill="none"/>
          {/* ember at very tip — pulsing */}
          <ellipse cx="290" cy="29" rx="6" ry="11" fill={`url(#ember-${uid})`}>
            <animate attributeName="opacity" values="0.85;1;0.8;1;0.9" dur="1.8s" repeatCount="indefinite"/>
          </ellipse>
          {/* hot flecks */}
          <circle cx="292" cy="25" r=".8" fill="#FFD27A">
            <animate attributeName="opacity" values="1;0.2;1;0.4;1" dur="0.9s" repeatCount="indefinite"/>
          </circle>
          <circle cx="289" cy="33" r=".6" fill="#FFB04A">
            <animate attributeName="opacity" values="0.3;1;0.5;1;0.3" dur="1.2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="293" cy="30" r=".5" fill="#FFE28A">
            <animate attributeName="opacity" values="1;0.3;0.9;0.2;1" dur="0.7s" repeatCount="indefinite"/>
          </circle>
        </>
      ) : (
        /* unlit foot shadow on right */
        <ellipse cx="286" cy="29" rx="3" ry="14" fill="rgba(0,0,0,0.3)"/>
      )}

      {/* band */}
      <rect x="54" y="12" width="64" height="34" fill={`url(#band-${uid})`}
        stroke="rgba(0,0,0,0.25)" strokeWidth=".5"/>
      <rect x="54" y="12" width="64" height="4" fill={foil}/>
      <rect x="54" y="42" width="64" height="4" fill={foil}/>
      <circle cx="86" cy="29" r="7" fill="none" stroke={foil} strokeWidth="1"/>
      <text x="86" y="32" textAnchor="middle" fill={foil}
        fontSize="8" fontFamily="Playfair Display, serif" fontWeight="700">C</text>
      {/* highlight along body */}
      <path d="M18 18 Q14 29 18 40" fill="none" stroke="rgba(255,240,210,0.15)" strokeWidth="2"/>
    </svg>
  );
}

function CigarCard({ cigar, onTap, onReview }) {
  const reviewed = cigar.reviewed;
  return (
    <div
      onClick={onTap}
      style={{
        background: THEME.cream,
        borderRadius: 18,
        padding: '14px 14px 12px',
        marginBottom: 10,
        boxShadow: `0 1px 0 ${THEME.line}, 0 8px 20px ${THEME.shadow}`,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* subtle corner stamp */}
      {cigar.owned > 0 && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          fontSize: 10, fontFamily: 'ui-monospace, monospace',
          color: THEME.muted, letterSpacing: 1,
        }}>×{cigar.owned}</div>
      )}

      {/* cigar visual */}
      <div style={{ margin: '2px -4px 10px', opacity: cigar.owned === 0 ? 0.35 : 1 }}>
        <CigarSvg band={cigar.bandColor} foil={cigar.foilColor} wrapperShade={cigar.wrapperShade} width={340} height={56}/>
      </div>

      {/* name */}
      <div style={{
        fontFamily: '"Playfair Display", Georgia, serif',
        fontSize: 19, fontWeight: 600, color: THEME.ink,
        lineHeight: 1.15, letterSpacing: -0.2,
      }}>{cigar.name}</div>

      <div style={{
        fontFamily: 'ui-monospace, "SF Mono", monospace',
        fontSize: 11, color: THEME.muted, marginTop: 3,
        letterSpacing: 0.3, textTransform: 'uppercase',
      }}>
        {cigar.vitola} · {cigar.size}
      </div>

      {/* bottom row — stars + price or unreviewed pill */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${THEME.line}`,
      }}>
        {reviewed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StarRow value={cigar.stars} size={14}/>
            <span style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 14, color: THEME.ink, fontWeight: 600,
            }}>{cigar.stars.toFixed(1)}</span>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onReview && onReview(); }}
            style={{
              background: THEME.leaf, color: THEME.cream,
              border: 'none', borderRadius: 999,
              padding: '5px 12px', fontSize: 12, fontWeight: 600,
              fontFamily: '-apple-system, system-ui',
              letterSpacing: 0.2, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <span style={{ fontSize: 14, lineHeight: 0 }}>✎</span>
            Write Review
          </button>
        )}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 13, color: THEME.inkSoft, fontFamily: 'ui-monospace, monospace',
        }}>
          ${cigar.price.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CigarCard, StarRow, CigarSvg });
