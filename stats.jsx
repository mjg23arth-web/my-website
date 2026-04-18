// Humidor stats dashboard — overview tab
// Relies on window.THEME, window.Icon, window.CigarSvg, window.FLAVOR_GROUPS

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: THEME.paper, borderRadius: 14,
      border: `1px solid ${THEME.line}`,
      padding: '14px 14px 12px',
      boxShadow: `0 1px 2px ${THEME.shadow}`,
    }}>
      <div style={{
        fontFamily: 'ui-monospace, monospace', fontSize: 10,
        color: THEME.muted, letterSpacing: 1.3, textTransform: 'uppercase',
        marginBottom: 6,
      }}>{label}</div>
      <div style={{
        fontFamily: '"Playfair Display", serif', fontSize: 26,
        fontWeight: 600, color: accent || THEME.ink,
        letterSpacing: -0.5, lineHeight: 1,
      }}>{value}</div>
      {sub && <div style={{
        fontFamily: '-apple-system, system-ui', fontSize: 11,
        color: THEME.muted, marginTop: 4,
      }}>{sub}</div>}
    </div>
  );
}

function RatingHistogram({ cigars }) {
  const buckets = [1,2,3,4,5].map(n => ({
    n,
    count: cigars.filter(c => c.reviewed && Math.round(c.stars) === n).length,
  }));
  const max = Math.max(...buckets.map(b => b.count), 1);
  return (
    <div style={{
      background: THEME.paper, borderRadius: 14,
      border: `1px solid ${THEME.line}`,
      padding: '14px', boxShadow: `0 1px 2px ${THEME.shadow}`,
    }}>
      <div style={{
        fontFamily: 'ui-monospace, monospace', fontSize: 10,
        color: THEME.muted, letterSpacing: 1.3, textTransform: 'uppercase',
        marginBottom: 10,
      }}>Rating Distribution</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 88 }}>
        {buckets.map(b => (
          <div key={b.n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: 10,
              color: b.count > 0 ? THEME.ink : THEME.muted, fontWeight: 600,
            }}>{b.count || ''}</div>
            <div style={{
              width: '100%',
              height: `${(b.count / max) * 66 + 2}px`,
              background: b.count > 0
                ? `linear-gradient(180deg, ${THEME.ember}, ${THEME.leaf})`
                : THEME.line,
              borderRadius: 4,
              opacity: b.count === 0 ? 0.4 : 1,
            }}/>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: 10,
              color: THEME.muted, letterSpacing: 0.4,
            }}>{b.n}★</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WrapperShadeChart({ cigars }) {
  const SHADES = [
    { name: 'Connecticut', hex: '#C89B67' },
    { name: 'Natural',     hex: '#A66A3C' },
    { name: 'Habano',      hex: '#7A3B1E' },
    { name: 'Maduro',      hex: '#3D1D0F' },
    { name: 'Oscuro',      hex: '#1E0E07' },
  ];
  const counts = SHADES.map(s => ({
    ...s, count: cigars.filter(c => (c.wrapperShade || 'Natural') === s.name).length,
  }));
  const total = counts.reduce((a,b) => a + b.count, 0) || 1;
  return (
    <div style={{
      background: THEME.paper, borderRadius: 14,
      border: `1px solid ${THEME.line}`,
      padding: '14px', boxShadow: `0 1px 2px ${THEME.shadow}`,
    }}>
      <div style={{
        fontFamily: 'ui-monospace, monospace', fontSize: 10,
        color: THEME.muted, letterSpacing: 1.3, textTransform: 'uppercase',
        marginBottom: 10,
      }}>Wrapper Shades</div>
      <div style={{
        display: 'flex', width: '100%', height: 18, borderRadius: 4,
        overflow: 'hidden', border: `1px solid ${THEME.line}`, marginBottom: 10,
      }}>
        {counts.filter(c => c.count > 0).map(c => (
          <div key={c.name} style={{
            flex: c.count, background: c.hex,
          }} title={`${c.name}: ${c.count}`}/>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 10px' }}>
        {counts.map(c => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 9, height: 9, borderRadius: 2, background: c.hex, border: `1px solid rgba(0,0,0,0.2)` }}/>
            <div style={{
              fontFamily: '-apple-system, system-ui', fontSize: 11,
              color: c.count > 0 ? THEME.ink : THEME.muted,
            }}>{c.name} <span style={{ color: THEME.muted }}>{c.count}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopOrigins({ cigars }) {
  const counts = {};
  cigars.forEach(c => {
    const o = c.origin || 'Unknown';
    counts[o] = (counts[o] || 0) + (c.owned || 1);
  });
  const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, 4);
  const max = sorted[0]?.[1] || 1;
  return (
    <div style={{
      background: THEME.paper, borderRadius: 14,
      border: `1px solid ${THEME.line}`,
      padding: '14px', boxShadow: `0 1px 2px ${THEME.shadow}`,
    }}>
      <div style={{
        fontFamily: 'ui-monospace, monospace', fontSize: 10,
        color: THEME.muted, letterSpacing: 1.3, textTransform: 'uppercase',
        marginBottom: 10,
      }}>Origins</div>
      {sorted.map(([o, n]) => (
        <div key={o} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <div style={{ fontFamily: '-apple-system, system-ui', fontSize: 12, color: THEME.ink }}>{o}</div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: THEME.muted }}>{n}</div>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: THEME.line, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${(n / max) * 100}%`,
              background: `linear-gradient(90deg, ${THEME.leaf}, ${THEME.ember})`,
              borderRadius: 3,
            }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function TopFlavors({ cigars }) {
  const counts = {};
  cigars.filter(c => c.reviewed && c.flavors).forEach(c => {
    c.flavors.forEach(f => { counts[f] = (counts[f] || 0) + 1; });
  });
  const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, 6);
  if (sorted.length === 0) return null;
  return (
    <div style={{
      background: THEME.paper, borderRadius: 14,
      border: `1px solid ${THEME.line}`,
      padding: '14px', boxShadow: `0 1px 2px ${THEME.shadow}`,
    }}>
      <div style={{
        fontFamily: 'ui-monospace, monospace', fontSize: 10,
        color: THEME.muted, letterSpacing: 1.3, textTransform: 'uppercase',
        marginBottom: 10,
      }}>Your Palate</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {sorted.map(([f, n]) => {
          const group = FLAVOR_GROUPS.find(g => g.notes.includes(f));
          return (
            <span key={f} style={{
              background: group?.color || THEME.leaf,
              color: '#fff', borderRadius: 999,
              padding: '4px 10px',
              fontFamily: '-apple-system, system-ui', fontSize: 12, fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              {f}
              <span style={{
                background: 'rgba(255,255,255,0.25)', borderRadius: 8,
                padding: '0 5px', fontSize: 10, fontFamily: 'ui-monospace, monospace',
              }}>{n}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function RecentlySmoked({ cigars, onTap }) {
  const recent = cigars
    .filter(c => c.smokedOn)
    .sort((a,b) => (b.smokedOn||'').localeCompare(a.smokedOn||''))
    .slice(0, 3);
  if (recent.length === 0) return null;
  return (
    <div style={{
      background: THEME.paper, borderRadius: 14,
      border: `1px solid ${THEME.line}`,
      boxShadow: `0 1px 2px ${THEME.shadow}`,
      overflow: 'hidden',
    }}>
      <div style={{
        fontFamily: 'ui-monospace, monospace', fontSize: 10,
        color: THEME.muted, letterSpacing: 1.3, textTransform: 'uppercase',
        padding: '14px 14px 8px',
      }}>Recently Smoked</div>
      {recent.map((c, i) => (
        <button key={c.id} onClick={() => onTap(c)} style={{
          width: '100%', border: 'none', background: 'transparent',
          borderTop: i === 0 ? 'none' : `1px solid ${THEME.line}`,
          padding: '10px 14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 12,
          textAlign: 'left',
        }}>
          <div style={{ width: 60, flexShrink: 0 }}>
            <CigarSvg band={c.bandColor} foil={c.foilColor} wrapperShade={c.wrapperShade} width={60} height={18}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: '-apple-system, system-ui', fontSize: 13,
              color: THEME.ink, fontWeight: 500,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{c.name}</div>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: 10,
              color: THEME.muted, letterSpacing: 0.3, marginTop: 2,
            }}>{c.smokedOn} · {'★'.repeat(Math.round(c.stars || 0))}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function StatsDashboard({ cigars, onCigarTap, onReset }) {
  const ownedList = cigars.filter(c => c.owned > 0);
  const reviewed = cigars.filter(c => c.reviewed);
  const totalValue = ownedList.reduce((sum, c) => sum + ((c.price || 0) * (c.owned || 0)), 0);
  const totalCount = ownedList.reduce((sum, c) => sum + (c.owned || 0), 0);
  const avgRating = reviewed.length
    ? (reviewed.reduce((s, c) => s + (c.stars || 0), 0) / reviewed.length).toFixed(1)
    : '—';
  const avgPrice = ownedList.length
    ? (ownedList.reduce((s, c) => s + (c.price || 0), 0) / ownedList.length).toFixed(0)
    : '—';

  return (
    <div style={{
      padding: '0 16px 100px',
      overflowY: 'auto', height: '100%',
    }}>
      <div style={{ padding: '58px 0 16px' }}>
        <div style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 10,
          color: THEME.muted, letterSpacing: 2, textTransform: 'uppercase',
        }}>At a glance</div>
        <div style={{
          fontFamily: '"Playfair Display", serif', fontSize: 30,
          fontWeight: 700, color: THEME.ink, letterSpacing: -0.5,
          marginTop: 2, lineHeight: 1.05,
        }}>Your Humidor</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <StatCard label="On hand" value={totalCount} sub={`${ownedList.length} unique`}/>
        <StatCard label="Avg rating" value={avgRating} sub={`${reviewed.length} reviewed`} accent={THEME.ember}/>
        <StatCard label="Total value" value={`$${totalValue.toFixed(0)}`} sub={`~$${avgPrice} each`}/>
        <StatCard label="Smoked" value={reviewed.filter(c => c.smokedOn).length} sub="all-time log"/>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <RatingHistogram cigars={cigars}/>
        <WrapperShadeChart cigars={cigars}/>
        <TopOrigins cigars={cigars}/>
        <TopFlavors cigars={cigars}/>
        <RecentlySmoked cigars={cigars} onTap={onCigarTap}/>
      </div>

      {onReset && (
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button onClick={() => {
            if (confirm('Reset all cigars to the starter set? This cannot be undone.')) onReset();
          }} style={{
            background: 'transparent', border: `1px solid ${THEME.line}`,
            color: THEME.muted, borderRadius: 999,
            padding: '8px 16px', cursor: 'pointer',
            fontFamily: '-apple-system, system-ui', fontSize: 12,
          }}>Reset to sample data</button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { StatsDashboard });
