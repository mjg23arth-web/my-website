// Review sheet — full-screen modal for reviewing a cigar
// Relies on window.THEME, window.Icon, window.StarRow

function RatingPicker({ label, value, onChange, color }) {
  const c = color || THEME.gold;
  const [pulse, setPulse] = React.useState(null);
  return (
    <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <style>{`@keyframes starPop { 0% { transform: scale(1); } 40% { transform: scale(1.35); } 100% { transform: scale(1); } }`}</style>
      <div>
        <div style={{
          fontFamily: '-apple-system, system-ui',
          fontSize: 15, color: THEME.ink, fontWeight: 500,
        }}>{label}</div>
        <div style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 11,
          color: THEME.muted, marginTop: 2, letterSpacing: 0.3,
        }}>{value ? value.toFixed(1) + ' / 5' : 'tap to rate'}</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[1,2,3,4,5].map(i => (
          <button key={i}
            onClick={() => {
              const newVal = i === value ? i - 0.5 : i;
              onChange(newVal);
              setPulse(i);
              setTimeout(() => setPulse(null), 300);
              if (navigator.vibrate) navigator.vibrate(8);
            }}
            style={{
              background: 'none', border: 'none', padding: 4,
              cursor: 'pointer', lineHeight: 0,
            }}>
            <span style={{
              position: 'relative', display: 'inline-block', width: 22, height: 22,
              animation: pulse === i ? 'starPop .3s ease' : 'none',
              transformOrigin: 'center',
            }}>
              {Icon.star(false, 'rgba(100,80,60,0.25)', 22)}
              <span style={{
                position: 'absolute', inset: 0, overflow: 'hidden',
                width: `${Math.max(0, Math.min(1, value - (i-1))) * 100}%`,
              }}>
                {Icon.star(true, c, 22)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children, icon }) {
  return (
    <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
      {icon && <div style={{ width: 22, display: 'flex', justifyContent: 'center' }}>{icon}</div>}
      <div style={{
        fontFamily: '-apple-system, system-ui',
        fontSize: 15, color: THEME.ink, width: 100, flexShrink: 0,
      }}>{label}</div>
      <div style={{ flex: 1, textAlign: 'right' }}>{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder, align = 'right', mono }) {
  return (
    <input
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        border: 'none', outline: 'none', background: 'transparent',
        textAlign: align, width: '100%',
        fontFamily: mono ? 'ui-monospace, monospace' : '-apple-system, system-ui',
        fontSize: 15, color: THEME.ink,
        padding: 0,
      }}
    />
  );
}

function SectionCard({ header, children, style }) {
  return (
    <div style={{ marginBottom: 18, ...style }}>
      {header && (
        <div style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 10,
          color: THEME.muted, padding: '0 24px 6px', letterSpacing: 1.4,
          textTransform: 'uppercase',
        }}>{header}</div>
      )}
      <div style={{
        background: THEME.cream, margin: '0 12px',
        borderRadius: 16,
        boxShadow: `0 1px 0 ${THEME.line}, 0 4px 16px ${THEME.shadow}`,
      }}>
        {React.Children.toArray(children).filter(Boolean).map((child, i, arr) => (
          <React.Fragment key={i}>
            {child}
            {i < arr.length - 1 && (
              <div style={{ height: 1, background: THEME.line, marginLeft: 16 }}/>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div style={{
      display: 'flex', background: THEME.paperDk,
      borderRadius: 10, padding: 2, gap: 2,
    }}>
      {options.map(opt => (
        <button key={opt}
          onClick={() => onChange(opt)}
          style={{
            flex: 1, border: 'none', borderRadius: 8,
            padding: '6px 8px', fontSize: 12,
            fontFamily: '-apple-system, system-ui', fontWeight: 500,
            background: value === opt ? THEME.leaf : 'transparent',
            color: value === opt ? THEME.cream : THEME.inkSoft,
            cursor: 'pointer',
            transition: 'all .15s',
          }}>
          {opt}
        </button>
      ))}
    </div>
  );
}

function ChipsField({ label, values, onChange, placeholder, suggestions = [] }) {
  const [input, setInput] = React.useState('');
  const arr = Array.isArray(values) ? values : (values ? String(values).split(/\s*[,/]\s*/).filter(Boolean) : []);
  const add = (v) => {
    const trimmed = (v || '').trim();
    if (!trimmed) return;
    if (arr.includes(trimmed)) { setInput(''); return; }
    onChange([...arr, trimmed]);
    setInput('');
  };
  const remove = (v) => onChange(arr.filter(x => x !== v));

  return (
    <div style={{ padding: '12px 16px' }}>
      <div style={{
        fontFamily: '-apple-system, system-ui', fontSize: 15,
        color: THEME.ink, marginBottom: 8,
      }}>{label}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {arr.map(v => (
          <span key={v} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: THEME.leaf, color: THEME.cream,
            padding: '4px 6px 4px 10px', borderRadius: 999,
            fontFamily: '-apple-system, system-ui', fontSize: 12, fontWeight: 500,
          }}>
            {v}
            <button onClick={() => remove(v)} style={{
              background: 'rgba(255,255,255,0.2)', border: 'none',
              width: 16, height: 16, borderRadius: 999,
              color: THEME.cream, cursor: 'pointer',
              fontSize: 10, lineHeight: '16px', padding: 0,
              fontFamily: '-apple-system, system-ui',
            }}>✕</button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input); }
            else if (e.key === 'Backspace' && !input && arr.length) remove(arr[arr.length-1]);
          }}
          onBlur={() => add(input)}
          placeholder={arr.length ? '+ add' : placeholder}
          style={{
            flex: '1 0 80px', minWidth: 80,
            border: `1px dashed ${THEME.line}`, borderRadius: 999,
            padding: '4px 10px', outline: 'none', background: 'transparent',
            fontFamily: '-apple-system, system-ui', fontSize: 12,
            color: THEME.ink,
          }}
        />
      </div>
      {suggestions.length > 0 && arr.length < 4 && (
        <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
          {suggestions.filter(s => !arr.includes(s)).slice(0, 6).map(s => (
            <button key={s} onClick={() => add(s)} style={{
              background: 'transparent', border: `1px solid ${THEME.line}`,
              borderRadius: 999, padding: '3px 9px',
              fontSize: 11, color: THEME.inkSoft,
              fontFamily: '-apple-system, system-ui', cursor: 'pointer',
            }}>+ {s}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewSheet({ cigar, onClose, onSave }) {
  const parseSize = (sz) => {
    if (!sz) return { length: cigar.length || '', ring: cigar.ring || '' };
    const m = String(sz).match(/([\d.⅛¼⅜½⅝¾⅞]+)\s*[×x*]\s*(\d+)/);
    if (!m) return { length: cigar.length || '', ring: cigar.ring || '' };
    const fracs = {'⅛':'.125','¼':'.25','⅜':'.375','½':'.5','⅝':'.625','¾':'.75','⅞':'.875'};
    let lenStr = m[1];
    Object.keys(fracs).forEach(f => { lenStr = lenStr.replace(f, fracs[f]); });
    return { length: lenStr, ring: m[2] };
  };
  const seed = parseSize(cigar.size);
  const [draft, setDraft] = React.useState({
    ...cigar,
    length: cigar.length || seed.length,
    ring: cigar.ring || seed.ring,
  });
  const [appearanceOpen, setAppearanceOpen] = React.useState(false);
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const handleSave = () => {
    const size = (draft.length && draft.ring) ? `${draft.length} × ${draft.ring}` : draft.size || '';
    onSave({ ...draft, size, reviewed: true });
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, background: THEME.paper,
      zIndex: 100, overflowY: 'auto',
      animation: 'slideUp .32s cubic-bezier(.22,.9,.3,1.1)',
    }}>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0);} }`}</style>

      {/* header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5,
        background: THEME.paper,
        padding: '50px 16px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${THEME.line}`,
      }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 6,
          color: THEME.inkSoft, fontFamily: '-apple-system, system-ui', fontSize: 15,
        }}>Cancel</button>
        <div style={{
          fontFamily: '"Playfair Display", serif', fontSize: 17,
          fontWeight: 600, color: THEME.ink,
        }}>Review</div>
        <button
          onClick={handleSave}
          style={{
          background: THEME.leaf, color: THEME.cream, border: 'none',
          borderRadius: 999, padding: '7px 14px',
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
          fontFamily: '-apple-system, system-ui',
        }}>Save</button>
      </div>

      {/* hero */}
      <div style={{ padding: '18px 16px 4px' }}>
        {/* Photo picker */}
        <div style={{ marginBottom: 12 }}>
          <label style={{
            display: 'block', position: 'relative', cursor: 'pointer',
            borderRadius: 14, overflow: 'hidden',
            background: draft.photo ? 'transparent' : THEME.paperDk,
            border: `1px dashed ${draft.photo ? 'transparent' : THEME.line}`,
            aspectRatio: '16 / 9',
            boxShadow: draft.photo ? `0 4px 14px ${THEME.shadow}` : 'none',
          }}>
            {draft.photo ? (
              <>
                <img src={draft.photo} alt="cigar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); set('photo', null); }}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 28, height: 28, borderRadius: 999,
                    background: 'rgba(20,10,4,0.7)', border: 'none',
                    color: '#fff', cursor: 'pointer',
                    fontSize: 14, fontFamily: '-apple-system, system-ui',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(6px)',
                  }}>✕</button>
              </>
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 6,
                color: THEME.inkSoft,
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke={THEME.inkSoft} strokeWidth="1.6"/>
                  <circle cx="9" cy="11" r="1.8" stroke={THEME.inkSoft} strokeWidth="1.4"/>
                  <path d="M3 17l5-5 4 4 3-3 6 6" stroke={THEME.inkSoft} strokeWidth="1.6" fill="none"/>
                </svg>
                <div style={{
                  fontFamily: '-apple-system, system-ui', fontSize: 13,
                  color: THEME.inkSoft,
                }}>Add a photo</div>
                <div style={{
                  fontFamily: 'ui-monospace, monospace', fontSize: 10,
                  color: THEME.muted, letterSpacing: 0.4,
                }}>TAP TO UPLOAD FROM LIBRARY</div>
              </div>
            )}
            <input type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => set('photo', reader.result);
                reader.readAsDataURL(file);
              }}/>
          </label>
        </div>

        <div style={{ margin: '0 -4px' }}>
          <CigarSvg band={draft.bandColor} foil={draft.foilColor} wrapperShade={draft.wrapperShade} width={370} height={60}/>
        </div>
        <input
          value={draft.name} onChange={e => set('name', e.target.value)}
          placeholder="Cigar name"
          style={{
            width: '100%', border: 'none', outline: 'none', background: 'transparent',
            fontFamily: '"Playfair Display", serif',
            fontSize: 26, fontWeight: 600, color: THEME.ink,
            letterSpacing: -0.4, marginTop: 6, padding: 0,
          }}
        />
        <input
          value={draft.vitola} onChange={e => set('vitola', e.target.value)}
          placeholder="Vitola / shape"
          style={{
            width: '100%', border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'ui-monospace, monospace',
            fontSize: 11, color: THEME.muted,
            letterSpacing: 1.2, textTransform: 'uppercase',
            marginTop: 2, padding: 0,
          }}
        />
      </div>

      {/* APPEARANCE — collapsible */}
      <div style={{ marginTop: 18 }}>
        <div style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 10,
          color: THEME.muted, padding: '0 24px 6px', letterSpacing: 1.4,
          textTransform: 'uppercase',
        }}>Appearance</div>
        <div style={{
          background: THEME.cream, margin: '0 12px',
          borderRadius: 16,
          boxShadow: `0 1px 0 ${THEME.line}, 0 4px 16px ${THEME.shadow}`,
          overflow: 'hidden',
        }}>
          <button
            onClick={() => setAppearanceOpen(v => !v)}
            style={{
              width: '100%', background: 'transparent', border: 'none',
              padding: '14px 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              textAlign: 'left',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* mini preview swatch */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '3px 6px', borderRadius: 7,
                background: THEME.paperDk,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 4,
                  background: `linear-gradient(180deg, ${shadeFor(draft.wrapperShade).top}, ${shadeFor(draft.wrapperShade).btm})`,
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
                }}/>
                <div style={{
                  width: 14, height: 14, borderRadius: 999,
                  background: draft.bandColor,
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
                }}/>
                <div style={{
                  width: 14, height: 14, borderRadius: 999,
                  background: draft.foilColor,
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
                }}/>
              </div>
              <div>
                <div style={{
                  fontFamily: '-apple-system, system-ui', fontSize: 15,
                  color: THEME.ink, fontWeight: 500,
                }}>Customize look</div>
                <div style={{
                  fontFamily: 'ui-monospace, monospace', fontSize: 10,
                  color: THEME.muted, marginTop: 2, letterSpacing: 0.3,
                }}>{draft.wrapperShade || 'Natural'} · band · foil</div>
              </div>
            </div>
            <div style={{
              transform: appearanceOpen ? 'rotate(90deg)' : 'rotate(0)',
              transition: 'transform .2s',
              color: THEME.muted,
            }}>{Icon.chevron(THEME.muted, 12)}</div>
          </button>

          {appearanceOpen && (
            <div style={{
              borderTop: `1px solid ${THEME.line}`,
              animation: 'expand .22s ease-out',
            }}>
              <style>{`@keyframes expand { from {opacity:0; transform: translateY(-4px);} to {opacity:1; transform: translateY(0);} }`}</style>
              <div style={{ padding: '14px 16px' }}>
                <div style={{
                  fontFamily: '-apple-system, system-ui', fontSize: 14,
                  color: THEME.ink, marginBottom: 8,
                }}>Wrapper shade</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {Object.keys(WRAPPER_SHADES).map(name => {
                    const sh = WRAPPER_SHADES[name];
                    const active = draft.wrapperShade === name;
                    return (
                      <button key={name} onClick={() => set('wrapperShade', name)} style={{
                        border: active ? `2px solid ${THEME.ink}` : `2px solid transparent`,
                        borderRadius: 10, padding: 3, cursor: 'pointer',
                        background: 'transparent',
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 7,
                          background: `linear-gradient(180deg, ${sh.top}, ${sh.mid} 55%, ${sh.btm})`,
                          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
                        }}/>
                        <div style={{
                          fontFamily: 'ui-monospace, monospace', fontSize: 9,
                          color: active ? THEME.ink : THEME.muted, marginTop: 3,
                          textAlign: 'center', letterSpacing: 0.3, fontWeight: active ? 600 : 400,
                        }}>{name.slice(0,7)}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ height: 1, background: THEME.line, marginLeft: 16 }}/>
              <div style={{ padding: '14px 16px' }}>
                <div style={{
                  fontFamily: '-apple-system, system-ui', fontSize: 14,
                  color: THEME.ink, marginBottom: 8,
                }}>Band color</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['#6B2C1E','#1C1C1C','#0E3A2E','#8B1212','#2B3A67','#5B3A12','#3E1246','#B08A3C','#FFFFFF'].map(col => {
                    const active = draft.bandColor === col;
                    return (
                      <button key={col} onClick={() => set('bandColor', col)} style={{
                        border: active ? `2px solid ${THEME.ink}` : `2px solid ${THEME.line}`,
                        borderRadius: 999, padding: 2, cursor: 'pointer',
                        background: 'transparent',
                      }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: 999,
                          background: col, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
                        }}/>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ height: 1, background: THEME.line, marginLeft: 16 }}/>
              <div style={{ padding: '14px 16px' }}>
                <div style={{
                  fontFamily: '-apple-system, system-ui', fontSize: 14,
                  color: THEME.ink, marginBottom: 8,
                }}>Band foil</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['#C89B3C','#E9C96A','#D4D4D4','#1F4C2E','#8B1212','#111111','#A97643'].map(col => {
                    const active = draft.foilColor === col;
                    return (
                      <button key={col} onClick={() => set('foilColor', col)} style={{
                        border: active ? `2px solid ${THEME.ink}` : `2px solid ${THEME.line}`,
                        borderRadius: 999, padding: 2, cursor: 'pointer',
                        background: 'transparent',
                      }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: 999,
                          background: col, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
                        }}/>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RATINGS */}
        <div style={{ marginTop: 18 }}/>
        <SectionCard header="Ratings">
          <RatingPicker label="Overall" value={draft.stars} onChange={v => set('stars', v)}/>
          <RatingPicker label="Construction" value={draft.construction} onChange={v => set('construction', v)}/>
          <RatingPicker label="Draw" value={draft.draw} onChange={v => set('draw', v)}/>
          <RatingPicker label="Burn" value={draft.burn} onChange={v => set('burn', v)}/>
        </SectionCard>

        {/* BLEND */}
        <SectionCard header="The Blend">
          <Field label="Origin" icon={Icon.leaf(THEME.leaf, 16)}>
            <TextInput value={draft.origin} onChange={v => set('origin', v)} placeholder="Country"/>
          </Field>
          <Field label="Wrapper">
            <TextInput value={draft.wrapper} onChange={v => set('wrapper', v)} placeholder="e.g. Ecuadorian Habano"/>
          </Field>
          <ChipsField
            label="Binder"
            values={draft.binder}
            onChange={v => set('binder', v)}
            placeholder="e.g. Nicaraguan"
            suggestions={['Nicaraguan','Dominican','Honduran','Mexican','Ecuadorian','Cuban']}
          />
          <ChipsField
            label="Filler"
            values={draft.filler}
            onChange={v => set('filler', v)}
            placeholder="e.g. Dominican"
            suggestions={['Nicaraguan','Dominican','Honduran','Mexican','Peruvian','Brazilian','Cuban','Pennsylvania']}
          />
          <div style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontFamily: '-apple-system, system-ui', fontSize: 15, color: THEME.ink }}>Size</div>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, color: THEME.ink }}>
                {draft.length || '—'}<span style={{color: THEME.muted, margin: '0 4px'}}>×</span>{draft.ring || '—'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: THEME.muted, marginBottom: 4, letterSpacing: 0.4 }}>LENGTH (IN)</div>
                <input
                  type="number" step="0.125" min="3" max="9"
                  value={draft.length || ''}
                  onChange={e => set('length', e.target.value)}
                  placeholder="6"
                  style={{
                    width: '100%', padding: '8px 10px', borderRadius: 8,
                    border: `1px solid ${THEME.line}`, background: THEME.paper,
                    fontFamily: 'ui-monospace, monospace', fontSize: 14,
                    color: THEME.ink, outline: 'none', boxSizing: 'border-box',
                  }}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: THEME.muted, marginBottom: 4, letterSpacing: 0.4 }}>RING GAUGE</div>
                <input
                  type="number" step="1" min="20" max="70"
                  value={draft.ring || ''}
                  onChange={e => set('ring', e.target.value)}
                  placeholder="52"
                  style={{
                    width: '100%', padding: '8px 10px', borderRadius: 8,
                    border: `1px solid ${THEME.line}`, background: THEME.paper,
                    fontFamily: 'ui-monospace, monospace', fontSize: 14,
                    color: THEME.ink, outline: 'none', boxSizing: 'border-box',
                  }}/>
              </div>
            </div>
          </div>
          <div style={{ padding: '12px 16px' }}>
            <div style={{
              fontFamily: '-apple-system, system-ui', fontSize: 15,
              color: THEME.ink, marginBottom: 8,
            }}>Strength</div>
            <Segmented
              options={['Mild','Med','Med-Full','Full']}
              value={draft.strength === 'Medium' ? 'Med' : draft.strength === 'Medium-Full' ? 'Med-Full' : draft.strength}
              onChange={v => set('strength', v)}
            />
          </div>
        </SectionCard>

        {/* PURCHASE */}
        <SectionCard header="Purchase">
          <Field label="Shop" icon={Icon.pin(THEME.inkSoft, 15)}>
            <TextInput value={draft.purchasedAt} onChange={v => set('purchasedAt', v)} placeholder="Where from"/>
          </Field>
          <Field label="Price" icon={Icon.dollar(THEME.inkSoft, 14)}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 2,
              background: THEME.paper, borderRadius: 8,
              border: `1px solid ${THEME.line}`,
              padding: '4px 8px',
            }}>
              <span style={{ color: THEME.muted, fontFamily: 'ui-monospace, monospace', fontSize: 14 }}>$</span>
              <input
                type="number" step="0.01" min="0" inputMode="decimal"
                value={draft.price === 0 ? '' : draft.price}
                onChange={e => set('price', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                style={{
                  width: 80, border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: 'ui-monospace, monospace', fontSize: 14,
                  color: THEME.ink, textAlign: 'right',
                }}/>
            </div>
          </Field>
          <Field label="Bought">
            <input type="date"
              value={draft.purchasedOn || ''}
              onChange={e => set('purchasedOn', e.target.value)}
              style={{
                border: `1px solid ${THEME.line}`, borderRadius: 8,
                background: THEME.paper, padding: '5px 8px',
                fontFamily: 'ui-monospace, monospace', fontSize: 13,
                color: THEME.ink, outline: 'none',
              }}/>
          </Field>
          <Field label="In humidor">
            <TextInput value={String(draft.owned)} onChange={v => set('owned', parseInt(v)||0)} placeholder="0" mono/>
          </Field>
        </SectionCard>

        {/* TASTING */}
        <SectionCard header="Tasting">
          <Field label="Smoked on">
            <input type="date"
              value={draft.smokedOn || ''}
              onChange={e => set('smokedOn', e.target.value)}
              style={{
                border: `1px solid ${THEME.line}`, borderRadius: 8,
                background: THEME.paper, padding: '5px 8px',
                fontFamily: 'ui-monospace, monospace', fontSize: 13,
                color: THEME.ink, outline: 'none',
              }}/>
          </Field>
          <Field label="Paired with" icon={Icon.flame(THEME.ember, 14)}>
            <TextInput value={draft.pairing} onChange={v => set('pairing', v)} placeholder="drink / coffee"/>
          </Field>
          <FlavorWheel
            values={draft.flavors || []}
            onChange={v => set('flavors', v)}
          />
          <ThirdsTimeline
            thirds={draft.thirds || {}}
            onChange={v => set('thirds', v)}
          />
          <div style={{ padding: '14px 16px' }}>
            <div style={{
              fontFamily: '-apple-system, system-ui', fontSize: 15,
              color: THEME.ink, marginBottom: 8,
            }}>Overall impression</div>
            <textarea
              value={draft.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Anything else worth remembering…"
              rows={3}
              style={{
                width: '100%', border: `1px solid ${THEME.line}`,
                borderRadius: 10, padding: 10,
                background: THEME.paper,
                fontFamily: 'Georgia, "Playfair Display", serif',
                fontSize: 14, color: THEME.ink,
                outline: 'none', resize: 'none',
                lineHeight: 1.5,
              }}
            />
          </div>
        </SectionCard>

        <div style={{ height: 40 }}/>
      </div>
    </div>
  );
}

Object.assign(window, { ReviewSheet, SectionCard, RatingPicker, Field, TextInput });
