// Flavor chips wheel, thirds timeline, stats dashboard, tasting-card share
// Relies on window.THEME, window.Icon, window.CigarSvg

// ────────── FLAVOR TAXONOMY ──────────
const FLAVOR_GROUPS = [
  { id: 'earth', label: 'Earth',  color: '#6B4A2B', notes: ['Leather','Cedar','Loam','Tobacco','Hay','Bark','Oak'] },
  { id: 'sweet', label: 'Sweet',  color: '#8B4513', notes: ['Cocoa','Chocolate','Caramel','Vanilla','Raisin','Honey','Molasses','Fig'] },
  { id: 'spice', label: 'Spice',  color: '#B8441F', notes: ['Black Pepper','White Pepper','Clove','Cinnamon','Cardamom','Nutmeg','Anise'] },
  { id: 'nut',   label: 'Nut',    color: '#A87947', notes: ['Almond','Walnut','Peanut','Cashew','Toasted Bread'] },
  { id: 'roast', label: 'Roast',  color: '#3D2817', notes: ['Espresso','Coffee','Toast','Charred Wood','Smoke','Char'] },
  { id: 'floral',label: 'Floral', color: '#9B7B4B', notes: ['Rose','Orange Blossom','Citrus Peel','Lavender','Tea'] },
  { id: 'fruit', label: 'Fruit',  color: '#7A3B24', notes: ['Cherry','Plum','Date','Stone Fruit','Apricot','Red Berry'] },
  { id: 'mineral',label:'Mineral',color: '#4A5A66', notes: ['Salt','Stone','Earth Mineral','Dust'] },
];

function FlavorWheel({ values = [], onChange }) {
  const toggle = (n) => {
    if (values.includes(n)) onChange(values.filter(v => v !== n));
    else onChange([...values, n]);
  };
  return (
    <div style={{ padding: '12px 16px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12,
      }}>
        <div style={{
          fontFamily: '-apple-system, system-ui', fontSize: 15,
          color: THEME.ink, fontWeight: 500,
        }}>Flavor profile</div>
        <div style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 11,
          color: THEME.muted, letterSpacing: 0.3,
        }}>{values.length} selected</div>
      </div>
      {FLAVOR_GROUPS.map(g => (
        <div key={g.id} style={{ marginBottom: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: 3, background: g.color,
            }}/>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: 10,
              color: THEME.muted, letterSpacing: 1.5, textTransform: 'uppercase',
            }}>{g.label}</div>
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {g.notes.map(n => {
              const active = values.includes(n);
              return (
                <button key={n} onClick={() => toggle(n)} style={{
                  background: active ? g.color : 'transparent',
                  color: active ? '#fff' : THEME.inkSoft,
                  border: `1px solid ${active ? g.color : THEME.line}`,
                  borderRadius: 999, padding: '4px 10px',
                  fontFamily: '-apple-system, system-ui', fontSize: 12,
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer', transition: 'all .15s',
                }}>{n}</button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ThirdsTimeline({ thirds = {}, onChange }) {
  const update = (k, v) => onChange({ ...thirds, [k]: v });
  const labels = [
    { k: 'first',  label: 'First Third',  sub: 'the light-up — opening notes' },
    { k: 'second', label: 'Second Third', sub: 'the heart — where it settles' },
    { k: 'third',  label: 'Final Third',  sub: 'the finish — concentration' },
  ];
  return (
    <div style={{ padding: '14px 16px' }}>
      <div style={{
        fontFamily: '-apple-system, system-ui', fontSize: 15,
        color: THEME.ink, fontWeight: 500, marginBottom: 10,
      }}>Across the thirds</div>
      <div style={{ position: 'relative' }}>
        {/* timeline spine */}
        <div style={{
          position: 'absolute', left: 9, top: 6, bottom: 6,
          width: 2, background: `linear-gradient(180deg, #E9C96A, ${THEME.ember}, ${THEME.leaf})`,
          borderRadius: 1,
        }}/>
        {labels.map((l, i) => (
          <div key={l.k} style={{ display: 'flex', gap: 14, marginBottom: i < 2 ? 12 : 0 }}>
            {/* node */}
            <div style={{
              width: 20, height: 20, borderRadius: 999, flexShrink: 0,
              background: i === 0 ? '#E9C96A' : i === 1 ? THEME.ember : THEME.leaf,
              border: `3px solid ${THEME.paper}`,
              boxShadow: `0 0 0 1px ${THEME.line}`,
              marginTop: 6,
            }}/>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: '-apple-system, system-ui', fontSize: 13,
                color: THEME.ink, fontWeight: 500,
              }}>{l.label}</div>
              <div style={{
                fontFamily: 'ui-monospace, monospace', fontSize: 10,
                color: THEME.muted, letterSpacing: 0.3, marginBottom: 6,
              }}>{l.sub}</div>
              <textarea
                value={thirds[l.k] || ''}
                onChange={e => update(l.k, e.target.value)}
                placeholder={i === 0 ? 'Leather, hay, gentle pepper…' : i === 1 ? 'Cocoa takes over, cedar returns…' : 'Espresso, long finish…'}
                rows={2}
                style={{
                  width: '100%', border: `1px solid ${THEME.line}`,
                  borderRadius: 10, padding: '8px 10px',
                  background: THEME.paper,
                  fontFamily: 'Georgia, serif', fontSize: 13,
                  color: THEME.ink, lineHeight: 1.4,
                  outline: 'none', resize: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Display-only version of flavor chips for detail card
function FlavorDisplay({ values = [] }) {
  if (!values.length) return null;
  // group them back
  const byGroup = {};
  values.forEach(v => {
    const g = FLAVOR_GROUPS.find(g => g.notes.includes(v));
    if (g) { byGroup[g.id] = byGroup[g.id] || { group: g, notes: [] }; byGroup[g.id].notes.push(v); }
  });
  return (
    <div style={{ padding: '14px 16px' }}>
      <div style={{
        fontFamily: 'ui-monospace, monospace', fontSize: 10,
        color: THEME.muted, letterSpacing: 1.4,
        textTransform: 'uppercase', marginBottom: 8,
      }}>Flavor Notes</div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {Object.values(byGroup).flatMap(({group, notes}) => notes.map(n => (
          <span key={n} style={{
            background: group.color, color: '#fff',
            borderRadius: 999, padding: '4px 10px',
            fontFamily: '-apple-system, system-ui', fontSize: 12, fontWeight: 500,
          }}>{n}</span>
        )))}
      </div>
    </div>
  );
}

Object.assign(window, { FlavorWheel, ThirdsTimeline, FlavorDisplay, FLAVOR_GROUPS });
