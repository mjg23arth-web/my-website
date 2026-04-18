// Main app — tabs, sort, list.
const { useState, useMemo, useEffect } = React;

const SORT_OPTIONS = [
  { id: 'rating_desc',  label: 'Best rated',        sub: '★ high → low' },
  { id: 'rating_asc',   label: 'Worst rated',       sub: '★ low → high' },
  { id: 'price_desc',   label: 'Most expensive',    sub: '$ high → low' },
  { id: 'price_asc',    label: 'Best value',        sub: '$ low → high' },
  { id: 'value_index',  label: 'Value index',       sub: '★ ÷ $ — bang-for-buck' },
  { id: 'recent',       label: 'Recently smoked',   sub: 'latest first' },
  { id: 'purchased',    label: 'Recently bought',   sub: 'latest first' },
  { id: 'name',         label: 'Alphabetical',      sub: 'A → Z' },
  { id: 'strength',     label: 'By strength',       sub: 'mild → full' },
  { id: 'owned_desc',   label: 'Most owned',        sub: 'humidor count' },
];

const STRENGTH_ORDER = ['Mild','Mild-Medium','Medium','Med','Medium-Full','Med-Full','Full'];

function sortCigars(list, sortId) {
  const copy = [...list];
  const byDate = (a,b) => (b||'').localeCompare(a||'');
  switch (sortId) {
    case 'rating_desc': return copy.sort((a,b) => b.stars - a.stars);
    case 'rating_asc':  return copy.sort((a,b) => a.stars - b.stars);
    case 'price_desc':  return copy.sort((a,b) => b.price - a.price);
    case 'price_asc':   return copy.sort((a,b) => a.price - b.price);
    case 'value_index': return copy.sort((a,b) => (b.stars / Math.max(1,b.price)) - (a.stars / Math.max(1,a.price)));
    case 'recent':      return copy.sort((a,b) => byDate(a.smokedOn, b.smokedOn));
    case 'purchased':   return copy.sort((a,b) => byDate(a.purchasedOn, b.purchasedOn));
    case 'name':        return copy.sort((a,b) => a.name.localeCompare(b.name));
    case 'strength':    return copy.sort((a,b) => STRENGTH_ORDER.indexOf(a.strength) - STRENGTH_ORDER.indexOf(b.strength));
    case 'owned_desc':  return copy.sort((a,b) => b.owned - a.owned);
    default: return copy;
  }
}

// ────────── Tab switcher ──────────
function TabBar({ tab, setTab, ownedCount, reviewedCount, allCount }) {
  const tabs = [
    { id: 'all',      label: 'All',       count: allCount },
    { id: 'owned',    label: 'Humidor',   count: ownedCount },
    { id: 'reviewed', label: 'Reviewed',  count: reviewedCount },
  ];
  return (
    <div style={{
      display: 'flex', gap: 4, padding: 4,
      background: THEME.paperDk, borderRadius: 12,
      margin: '0 16px 12px',
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)}
          style={{
            flex: 1, border: 'none',
            background: tab === t.id ? THEME.cream : 'transparent',
            color: tab === t.id ? THEME.ink : THEME.inkSoft,
            padding: '8px 6px', borderRadius: 9,
            fontFamily: '-apple-system, system-ui',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: tab === t.id ? `0 1px 3px ${THEME.shadow}` : 'none',
            transition: 'all .18s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
          {t.label}
          <span style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: 10, color: THEME.muted,
            background: tab === t.id ? THEME.paper : 'transparent',
            padding: '1px 6px', borderRadius: 6,
          }}>{t.count}</span>
        </button>
      ))}
    </div>
  );
}

// ────────── Sort sheet ──────────
function SortSheet({ open, onClose, value, onChange }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 80,
      background: 'rgba(30,20,10,0.35)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'fadeIn .2s',
    }}>
      <style>{`@keyframes fadeIn { from {opacity:0;} to {opacity:1;}}
                @keyframes slideS { from {transform: translateY(100%);} to {transform:translateY(0);}}`}</style>
      <div onClick={e => e.stopPropagation()} style={{
        background: THEME.paper, width: '100%',
        borderTopLeftRadius: 22, borderTopRightRadius: 22,
        padding: '10px 0 34px',
        animation: 'slideS .3s cubic-bezier(.22,.9,.3,1.1)',
        maxHeight: '75%', overflowY: 'auto',
      }}>
        <div style={{
          width: 36, height: 4, background: THEME.line,
          borderRadius: 4, margin: '0 auto 12px',
        }}/>
        <div style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 20, fontWeight: 600, color: THEME.ink,
          padding: '4px 20px 12px',
        }}>Sort by</div>
        {SORT_OPTIONS.map(opt => {
          const active = opt.id === value;
          return (
            <button key={opt.id}
              onClick={() => { onChange(opt.id); onClose(); }}
              style={{
                width: '100%', border: 'none', background: 'transparent',
                padding: '12px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', textAlign: 'left',
              }}>
              <div>
                <div style={{
                  fontFamily: '-apple-system, system-ui', fontSize: 16,
                  color: active ? THEME.leaf : THEME.ink, fontWeight: active ? 600 : 500,
                }}>{opt.label}</div>
                <div style={{
                  fontFamily: 'ui-monospace, monospace', fontSize: 11,
                  color: THEME.muted, marginTop: 2, letterSpacing: 0.3,
                }}>{opt.sub}</div>
              </div>
              {active && (
                <div style={{
                  width: 26, height: 26, borderRadius: 999,
                  background: THEME.leaf, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>{Icon.check(THEME.cream, 14)}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ────────── Aging tracker ──────────
function AgingTracker({ purchasedOn }) {
  const days = Math.max(0, Math.floor((new Date('2026-04-17') - new Date(purchasedOn)) / 86400000));
  const OPTIMAL = 60;
  const pct = Math.min(100, (days / OPTIMAL) * 100);
  const rested = days >= OPTIMAL;
  return (
    <div style={{ padding: '12px 16px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6,
      }}>
        <div style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 10,
          color: THEME.muted, letterSpacing: 1.3, textTransform: 'uppercase',
        }}>Resting in humidor</div>
        <div style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 11,
          color: rested ? THEME.leaf : THEME.inkSoft, fontWeight: 600,
        }}>{days} day{days === 1 ? '' : 's'}</div>
      </div>
      <div style={{
        height: 6, borderRadius: 3, background: THEME.line, overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${THEME.ember}, ${THEME.leaf})`,
          borderRadius: 3, transition: 'width .6s',
        }}/>
      </div>
      <div style={{
        fontFamily: '-apple-system, system-ui', fontSize: 11,
        color: rested ? THEME.leaf : THEME.muted, marginTop: 5, fontStyle: 'italic',
      }}>
        {rested
          ? '✓ Well-rested — ready to smoke.'
          : `${OPTIMAL - days} days until optimal rest (${OPTIMAL}-day benchmark).`}
      </div>
    </div>
  );
}

// ────────── Detail sheet (read mode) ──────────
function renderBlendValue(v) {
  const arr = Array.isArray(v) ? v : (v ? String(v).split(/\s*[,/]\s*/).filter(Boolean) : []);
  if (arr.length === 0) return <span style={{color: THEME.muted}}>—</span>;
  if (arr.length === 1) return <span style={{color: THEME.ink}}>{arr[0]}</span>;
  return (
    <div style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
      {arr.map(x => (
        <span key={x} style={{
          background: THEME.paperDk, color: THEME.ink,
          padding: '2px 8px', borderRadius: 999,
          fontFamily: '-apple-system, system-ui', fontSize: 12, fontWeight: 500,
          border: `1px solid ${THEME.line}`,
        }}>{x}</span>
      ))}
    </div>
  );
}

function DetailSheet({ cigar, onClose, onEdit, onShare }) {
  if (!cigar) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 90,
      background: THEME.paper, overflowY: 'auto',
      animation: 'slideU .3s cubic-bezier(.22,.9,.3,1.1)',
    }}>
      <style>{`@keyframes slideU { from {transform:translateY(100%);} to {transform:translateY(0);}}`}</style>
      <div style={{
        position: 'sticky', top: 0, background: THEME.paper, zIndex: 2,
        padding: '50px 16px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${THEME.line}`,
      }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 6,
          color: THEME.inkSoft, fontSize: 15, fontFamily: '-apple-system, system-ui',
        }}>Close</button>
        <div style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 10,
          color: THEME.muted, letterSpacing: 1.5, textTransform: 'uppercase',
        }}>Tasting Card</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {cigar.reviewed && onShare && (
            <button onClick={onShare} title="Share" style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, color: THEME.inkSoft,
              display: 'inline-flex', alignItems: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3v12M12 3l-4 4M12 3l4 4M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5"/>
              </svg>
            </button>
          )}
          <button onClick={onEdit} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 6,
            color: THEME.leaf, fontSize: 15, fontWeight: 600,
            fontFamily: '-apple-system, system-ui',
          }}>Edit</button>
        </div>
      </div>

      <div style={{ padding: '20px 16px 8px' }}>
        {cigar.photo && (
          <div style={{
            marginBottom: 14, borderRadius: 14, overflow: 'hidden',
            aspectRatio: '16 / 9',
            boxShadow: `0 4px 14px ${THEME.shadow}`,
          }}>
            <img src={cigar.photo} alt={cigar.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
          </div>
        )}
        <div style={{ margin: '0 -4px' }}>
          <CigarSvg band={cigar.bandColor} foil={cigar.foilColor} wrapperShade={cigar.wrapperShade} width={370} height={64}/>
        </div>
        <div style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 28, fontWeight: 600, color: THEME.ink,
          marginTop: 8, letterSpacing: -0.4, lineHeight: 1.1,
        }}>{cigar.name}</div>
        <div style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 11,
          color: THEME.muted, letterSpacing: 1.2, textTransform: 'uppercase',
          marginTop: 4,
        }}>{cigar.origin} · {cigar.vitola} · {cigar.size}</div>
      </div>

      {cigar.reviewed && (
        <div style={{
          display: 'flex', gap: 8, padding: '14px 16px 4px',
        }}>
          {[
            { label: 'Overall', v: cigar.stars },
            { label: 'Build',   v: cigar.construction },
            { label: 'Draw',    v: cigar.draw },
            { label: 'Burn',    v: cigar.burn },
          ].map(m => (
            <div key={m.label} style={{
              flex: 1, background: THEME.cream,
              borderRadius: 12, padding: '10px 8px',
              textAlign: 'center',
              boxShadow: `0 1px 0 ${THEME.line}`,
            }}>
              <div style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 22, fontWeight: 700, color: THEME.ink,
              }}>{m.v.toFixed(1)}</div>
              <div style={{
                fontFamily: 'ui-monospace, monospace', fontSize: 9,
                color: THEME.muted, letterSpacing: 1, textTransform: 'uppercase', marginTop: 2,
              }}>{m.label}</div>
            </div>
          ))}
        </div>
      )}

      <SectionCard header="The Blend">
        <Field label="Origin">{<span style={{color:THEME.ink}}>{cigar.origin}</span>}</Field>
        <Field label="Wrapper">{<span style={{color:THEME.ink}}>{cigar.wrapper}</span>}</Field>
        <Field label="Binder">{renderBlendValue(cigar.binder)}</Field>
        <Field label="Filler">{renderBlendValue(cigar.filler)}</Field>
        <Field label="Size">{<span style={{color:THEME.ink, fontFamily:'ui-monospace, monospace', fontSize:14}}>{cigar.size}</span>}</Field>
        <Field label="Strength">{<span style={{color:THEME.ink}}>{cigar.strength}</span>}</Field>
      </SectionCard>

      <SectionCard header="Purchase">
        <Field label="Shop">{<span style={{color:THEME.ink}}>{cigar.purchasedAt}</span>}</Field>
        <Field label="Price">{<span style={{color:THEME.ink, fontFamily:'ui-monospace, monospace'}}>${cigar.price.toFixed(2)}</span>}</Field>
        <Field label="Bought">{<span style={{color:THEME.ink, fontFamily:'ui-monospace, monospace', fontSize:14}}>{cigar.purchasedOn}</span>}</Field>
        <Field label="Humidor">{<span style={{color:THEME.ink}}>{cigar.owned} on hand</span>}</Field>
        {cigar.purchasedOn && cigar.owned > 0 && <AgingTracker purchasedOn={cigar.purchasedOn}/>}
      </SectionCard>

      {cigar.reviewed && cigar.flavors && cigar.flavors.length > 0 && (
        <SectionCard>
          <FlavorDisplay values={cigar.flavors}/>
        </SectionCard>
      )}

      {cigar.reviewed && cigar.thirds && (cigar.thirds.first || cigar.thirds.second || cigar.thirds.third) && (
        <SectionCard header="Across the thirds">
          <div style={{ padding: '12px 16px', position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 25, top: 20, bottom: 20,
              width: 2, background: `linear-gradient(180deg, #E9C96A, ${THEME.ember}, ${THEME.leaf})`,
              borderRadius: 1,
            }}/>
            {[
              { k: 'first',  label: 'First',  color: '#E9C96A' },
              { k: 'second', label: 'Heart',  color: THEME.ember },
              { k: 'third',  label: 'Finish', color: THEME.leaf },
            ].map((l, i) => cigar.thirds[l.k] ? (
              <div key={l.k} style={{ display: 'flex', gap: 14, marginBottom: i < 2 ? 12 : 0 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 999, flexShrink: 0,
                  background: l.color,
                  border: `3px solid ${THEME.paper}`,
                  boxShadow: `0 0 0 1px ${THEME.line}`,
                  marginTop: 4, zIndex: 1,
                }}/>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'ui-monospace, monospace', fontSize: 10,
                    color: THEME.muted, letterSpacing: 1.2,
                    textTransform: 'uppercase', marginBottom: 2,
                  }}>{l.label}</div>
                  <div style={{
                    fontFamily: 'Georgia, "Playfair Display", serif',
                    fontSize: 14, lineHeight: 1.5, color: THEME.ink,
                  }}>{cigar.thirds[l.k]}</div>
                </div>
              </div>
            ) : null)}
          </div>
        </SectionCard>
      )}

      {cigar.reviewed && cigar.notes && (
        <SectionCard header="Overall Impression">
          <div style={{ padding: '14px 16px' }}>
            {cigar.pairing && (
              <div style={{
                fontFamily: 'ui-monospace, monospace', fontSize: 11,
                color: THEME.muted, letterSpacing: 0.5, marginBottom: 8,
              }}>PAIRED WITH {cigar.pairing.toUpperCase()} {cigar.smokedOn && `· ${cigar.smokedOn}`}</div>
            )}
            <div style={{
              fontFamily: 'Georgia, "Playfair Display", serif',
              fontSize: 15, lineHeight: 1.55, color: THEME.ink,
            }}>{cigar.notes}</div>
          </div>
        </SectionCard>
      )}

      <div style={{ height: 60 }}/>
    </div>
  );
}

// ────────── Root app ──────────
const STORAGE_KEY = 'emberAndAsh.cigars.v1';

function loadCigars() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load cigars from storage:', e);
  }
  return SAMPLE_CIGARS;
}

function App() {
  const [cigars, setCigars] = useState(loadCigars);
  const [view, setView] = useState('humidor'); // humidor | stats
  const [tab, setTab] = useState('all');
  const [sort, setSort] = useState('rating_desc');
  const [sortOpen, setSortOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [review, setReview] = useState(null); // cigar being reviewed
  const [share, setShare] = useState(null);
  const [query, setQuery] = useState('');

  // Persist to localStorage whenever cigars change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cigars));
    } catch (e) {
      console.warn('Failed to save cigars to storage:', e);
    }
  }, [cigars]);

  const filtered = useMemo(() => {
    let list = cigars;
    if (tab === 'owned')    list = list.filter(c => c.owned > 0);
    if (tab === 'reviewed') list = list.filter(c => c.reviewed);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.origin||'').toLowerCase().includes(q) ||
        (c.wrapper||'').toLowerCase().includes(q));
    }
    // sorts that don't apply to unreviewed → push unreviewed to bottom
    if (sort.startsWith('rating') || sort === 'recent' || sort === 'value_index') {
      const reviewed = list.filter(c => c.reviewed);
      const unrev = list.filter(c => !c.reviewed);
      return [...sortCigars(reviewed, sort), ...unrev];
    }
    return sortCigars(list, sort);
  }, [cigars, tab, sort, query]);

  const ownedCount    = cigars.filter(c => c.owned > 0).length;
  const reviewedCount = cigars.filter(c => c.reviewed).length;

  const sortLabel = SORT_OPTIONS.find(o => o.id === sort)?.label || 'Sort';

  const saveReview = (updated) => {
    setCigars(list => list.map(c => c.id === updated.id ? updated : c));
    setReview(null);
    setDetail(updated);
  };

  // ── screen
  return (
    <div style={{
      height: '100%', background: THEME.paper,
      position: 'relative', overflow: 'hidden',
      backgroundImage: `radial-gradient(ellipse at top, rgba(200,155,60,0.08), transparent 60%),
                        repeating-linear-gradient(45deg, transparent 0 12px, rgba(120,80,40,0.015) 12px 13px)`,
    }}>
      {view === 'stats' ? (
        <StatsDashboard cigars={cigars} onCigarTap={(c) => setDetail(c)} onReset={() => {
          localStorage.removeItem(STORAGE_KEY);
          setCigars(SAMPLE_CIGARS);
        }}/>
      ) : (<>
      {/* Custom header */}
      <div style={{ padding: '58px 20px 8px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: 10,
              color: THEME.muted, letterSpacing: 2, textTransform: 'uppercase',
            }}>Est. 2026 · The Humidor</div>
            <div style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 30, fontWeight: 700, color: THEME.ink,
              letterSpacing: -0.6, lineHeight: 1.05, marginTop: 2,
              whiteSpace: 'nowrap',
            }}>Ember <span style={{ color: THEME.ember, fontStyle: 'italic' }}>&amp;</span> Ash</div>
          </div>
          <button onClick={() => {
            const newCigar = {
              id: 'c' + Date.now(),
              name: '', vitola: '', origin: '',
              wrapper: '', binder: '', filler: '',
              size: '', strength: 'Med',
              owned: 1, reviewed: false,
              stars: 0, construction: 0, draw: 0, burn: 0,
              price: 0, purchasedAt: '', purchasedOn: '',
              bandColor: '#6B2C1E', foilColor: '#C89B3C',
              notes: '', pairing: '', smokedOn: null,
              __isNew: true,
            };
            setCigars(list => [newCigar, ...list]);
            setReview(newCigar);
          }} style={{
            width: 42, height: 42, borderRadius: 999,
            background: THEME.leaf, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 14px rgba(77,58,34,0.35)`,
          }}>{Icon.plus(THEME.cream, 20)}</button>
        </div>
      </div>

      {/* Search + sort row */}
      <div style={{ padding: '6px 16px 10px', display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, background: THEME.cream, borderRadius: 11,
          padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: `0 1px 0 ${THEME.line}`,
        }}>
          {Icon.search(THEME.muted, 15)}
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search cigars, origin, wrapper…"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: '-apple-system, system-ui', fontSize: 14,
              color: THEME.ink,
            }}
          />
        </div>
        <button onClick={() => setSortOpen(true)} style={{
          background: THEME.cream, border: 'none', borderRadius: 11,
          padding: '0 12px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: `0 1px 0 ${THEME.line}`,
          fontFamily: '-apple-system, system-ui', fontSize: 13,
          color: THEME.ink, fontWeight: 500,
        }}>
          {Icon.sort(THEME.inkSoft, 16)}
          <span>{sortLabel}</span>
        </button>
      </div>

      {/* Tabs */}
      <TabBar tab={tab} setTab={setTab}
        allCount={cigars.length}
        ownedCount={ownedCount} reviewedCount={reviewedCount}/>

      {/* List */}
      <div style={{
        padding: '0 12px 80px',
        height: 'calc(100% - 225px)', overflowY: 'auto',
      }}>
        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            fontFamily: 'Georgia, serif', fontSize: 15,
            color: THEME.muted, fontStyle: 'italic',
          }}>Your humidor is empty…</div>
        )}
        {filtered.map(c => (
          <CigarCard key={c.id} cigar={c}
            onTap={() => setDetail(c)}
            onReview={() => setReview(c)}/>
        ))}
      </div>
      </>)}

      {/* Bottom nav */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(246,235,218,0.92)',
        backdropFilter: 'blur(14px)',
        borderTop: `1px solid ${THEME.line}`,
        padding: '8px 16px 28px',
        display: 'flex', justifyContent: 'space-around',
        zIndex: 20,
      }}>
        {[
          { id: 'humidor', label: 'Humidor', icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="6" width="18" height="14" rx="2"/>
              <path d="M3 10h18M8 6V4M16 6V4"/>
            </svg>
          )},
          { id: 'stats', label: 'Stats', icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>
            </svg>
          )},
        ].map(n => {
          const active = view === n.id;
          return (
            <button key={n.id} onClick={() => setView(n.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '4px 22px',
              color: active ? THEME.leaf : THEME.muted,
            }}>
              {n.icon}
              <span style={{
                fontFamily: '-apple-system, system-ui', fontSize: 10.5,
                fontWeight: active ? 600 : 500, letterSpacing: 0.2,
              }}>{n.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sheets */}
      <SortSheet open={sortOpen} onClose={() => setSortOpen(false)}
        value={sort} onChange={setSort}/>

      {detail && !review && (
        <DetailSheet cigar={detail}
          onClose={() => setDetail(null)}
          onEdit={() => setReview(detail)}
          onShare={() => setShare(detail)}/>
      )}

      {share && (
        <ShareCard cigar={share} onClose={() => setShare(null)}/>
      )}

      {review && (
        <ReviewSheet cigar={review}
          onClose={() => {
            if (review.__isNew) {
              setCigars(list => list.filter(c => c.id !== review.id));
            }
            setReview(null);
          }}
          onSave={(updated) => {
            const { __isNew, ...clean } = updated;
            saveReview(clean);
          }}/>
      )}
    </div>
  );
}

window.App = App;

if (window.__MOUNT_IN_FRAME) {
  function FramedRoot() {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #3a2a1c 0%, #1a1008 65%, #0d0704 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px', fontFamily: '-apple-system, system-ui',
      }}>
        <IOSDevice width={402} height={874} dark={false}>
          <App/>
        </IOSDevice>
      </div>
    );
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<FramedRoot/>);
}
