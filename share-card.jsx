// Tasting Card — shareable portrait export
// Relies on window.THEME, window.CigarSvg, window.FLAVOR_GROUPS

function ShareCard({ cigar, onClose }) {
  if (!cigar) return null;
  const stars = cigar.stars || 0;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 120,
      background: 'rgba(10,5,2,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column',
      animation: 'fadeUp .3s ease',
    }}>
      <style>{`@keyframes fadeUp { from { opacity: 0; } to { opacity: 1; }}`}</style>

      {/* header */}
      <div style={{
        padding: '50px 16px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.1)', border: 'none',
          borderRadius: 999, width: 34, height: 34, cursor: 'pointer',
          color: '#fff', fontSize: 18, fontFamily: '-apple-system, system-ui',
        }}>✕</button>
        <div style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 10,
          color: 'rgba(255,255,255,0.7)', letterSpacing: 1.5, textTransform: 'uppercase',
        }}>Tasting Card</div>
        <div style={{ width: 34 }}/>
      </div>

      {/* the card */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '8px 18px 20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: '100%', maxWidth: 340,
          background: `linear-gradient(180deg, #F6EBDA 0%, #EADFCD 100%)`,
          borderRadius: 20,
          padding: '26px 22px 22px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
          position: 'relative',
          overflow: 'hidden',
          // paper grain
          backgroundImage: `
            radial-gradient(ellipse at top left, rgba(200,155,60,0.15), transparent 60%),
            radial-gradient(ellipse at bottom right, rgba(61,28,14,0.1), transparent 60%),
            repeating-linear-gradient(47deg, transparent 0 3px, rgba(120,80,40,0.025) 3px 4px),
            linear-gradient(180deg, #F6EBDA 0%, #EADFCD 100%)
          `,
        }}>
          {/* corner flourishes */}
          <div style={{
            position: 'absolute', top: 10, left: 10, width: 22, height: 22,
            borderTop: `1.5px solid ${THEME.ember}`, borderLeft: `1.5px solid ${THEME.ember}`,
            borderTopLeftRadius: 4,
          }}/>
          <div style={{
            position: 'absolute', top: 10, right: 10, width: 22, height: 22,
            borderTop: `1.5px solid ${THEME.ember}`, borderRight: `1.5px solid ${THEME.ember}`,
            borderTopRightRadius: 4,
          }}/>
          <div style={{
            position: 'absolute', bottom: 10, left: 10, width: 22, height: 22,
            borderBottom: `1.5px solid ${THEME.ember}`, borderLeft: `1.5px solid ${THEME.ember}`,
            borderBottomLeftRadius: 4,
          }}/>
          <div style={{
            position: 'absolute', bottom: 10, right: 10, width: 22, height: 22,
            borderBottom: `1.5px solid ${THEME.ember}`, borderRight: `1.5px solid ${THEME.ember}`,
            borderBottomRightRadius: 4,
          }}/>

          {/* masthead */}
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: 9,
              color: THEME.muted, letterSpacing: 2.5, textTransform: 'uppercase',
            }}>Ember &amp; Ash</div>
            <div style={{
              fontFamily: '"Playfair Display", serif', fontSize: 11,
              fontStyle: 'italic', color: THEME.inkSoft, marginTop: 2, letterSpacing: 0.3,
            }}>— a tasting note —</div>
          </div>

          {/* cigar */}
          <div style={{ margin: '0 -8px 6px' }}>
            <CigarSvg band={cigar.bandColor} foil={cigar.foilColor} wrapperShade={cigar.wrapperShade} width={310} height={52}/>
          </div>

          {/* name */}
          <div style={{
            fontFamily: '"Playfair Display", serif', fontSize: 22,
            fontWeight: 600, color: THEME.ink, lineHeight: 1.1,
            letterSpacing: -0.3, textAlign: 'center', marginTop: 6,
          }}>{cigar.name}</div>

          {/* meta */}
          <div style={{
            fontFamily: 'ui-monospace, monospace', fontSize: 10,
            color: THEME.muted, letterSpacing: 1, textTransform: 'uppercase',
            textAlign: 'center', marginTop: 4,
          }}>
            {[cigar.origin, cigar.vitola, cigar.size].filter(Boolean).join(' · ')}
          </div>

          {/* stars */}
          <div style={{
            textAlign: 'center', marginTop: 14,
            fontSize: 20, color: THEME.ember, letterSpacing: 2,
          }}>
            {'★'.repeat(Math.round(stars))}
            <span style={{ color: 'rgba(184,68,31,0.25)' }}>{'★'.repeat(5 - Math.round(stars))}</span>
          </div>
          <div style={{
            textAlign: 'center',
            fontFamily: 'ui-monospace, monospace', fontSize: 11,
            color: THEME.inkSoft, letterSpacing: 0.8, marginTop: 3,
          }}>{stars.toFixed(1)} / 5</div>

          {/* flavor chips */}
          {cigar.flavors && cigar.flavors.length > 0 && (
            <>
              <div style={{ height: 1, background: 'rgba(61,28,14,0.15)', margin: '14px -4px' }}/>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center',
              }}>
                {cigar.flavors.slice(0, 8).map(f => {
                  const g = FLAVOR_GROUPS.find(g => g.notes.includes(f));
                  return (
                    <span key={f} style={{
                      background: g?.color || THEME.leaf, color: '#fff',
                      borderRadius: 999, padding: '3px 9px',
                      fontFamily: '-apple-system, system-ui', fontSize: 10.5, fontWeight: 500,
                    }}>{f}</span>
                  );
                })}
              </div>
            </>
          )}

          {/* notes */}
          {cigar.notes && (
            <div style={{
              fontFamily: 'Georgia, "Playfair Display", serif', fontSize: 12.5,
              fontStyle: 'italic', color: THEME.ink, lineHeight: 1.5,
              textAlign: 'center', marginTop: 12,
              padding: '0 4px',
            }}>
              “{cigar.notes.length > 180 ? cigar.notes.slice(0, 180) + '…' : cigar.notes}”
            </div>
          )}

          {/* footer */}
          <div style={{
            marginTop: 16, paddingTop: 10,
            borderTop: `1px dashed rgba(61,28,14,0.2)`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: 9,
              color: THEME.muted, letterSpacing: 0.8,
            }}>
              {cigar.pairing ? `W/ ${cigar.pairing.toUpperCase()}` : ''}
            </div>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: 9,
              color: THEME.muted, letterSpacing: 0.8,
            }}>{cigar.smokedOn || ''}</div>
          </div>
        </div>

        {/* share actions */}
        <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 340 }}>
          <button onClick={() => alert('In a real app: saves image to Photos')} style={{
            flex: 1, background: THEME.cream, color: THEME.ink, border: 'none',
            borderRadius: 12, padding: '12px', cursor: 'pointer',
            fontFamily: '-apple-system, system-ui', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5-11 11"/>
            </svg>
            Save image
          </button>
          <button onClick={() => alert('In a real app: opens share sheet')} style={{
            flex: 1, background: THEME.leaf, color: THEME.cream, border: 'none',
            borderRadius: 12, padding: '12px', cursor: 'pointer',
            fontFamily: '-apple-system, system-ui', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v12M12 3l-4 4M12 3l4 4M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5"/>
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ShareCard });
