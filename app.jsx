// Main cigar app — tabs, sort, cigar cards, review sheet
// Uses window.IOSDevice, IOSGlassPill from ios-frame.jsx

const { useState, useMemo, useEffect } = React;

// ──────────────────────────────────────────────────────────────
// THEME — tobacco leather humidor
// ──────────────────────────────────────────────────────────────
const THEME = {
  paper:    '#F3ECDF',   // parchment page
  paperDk:  '#E9DFCB',
  ink:      '#2A1F17',   // espresso ink
  inkSoft:  '#5C4A3A',
  muted:    '#9C8A76',
  line:     '#D9CDB5',
  leaf:     '#4D3A22',   // cigar leaf brown
  band:     '#A97643',   // cigar band copper
  ember:    '#D96A2C',   // lit ember
  gold:     '#C89B3C',   // rating gold
  cream:    '#FAF5EA',
  shadow:   'rgba(80,50,20,0.12)',
};

// ──────────────────────────────────────────────────────────────
// SAMPLE DATA
// ──────────────────────────────────────────────────────────────
const SAMPLE_CIGARS = [
  {
    id: 'c1', name: 'Padrón 1964 Anniversary', vitola: 'Exclusivo Maduro',
    origin: 'Nicaragua', wrapper: 'Nicaraguan Maduro', binder: 'Nicaraguan', filler: 'Nicaraguan',
    size: '5½ × 50', strength: 'Full',
    owned: 2, reviewed: true,
    stars: 4.8, construction: 5.0, draw: 4.7, burn: 4.9,
    price: 22.50, purchasedAt: 'Holt\'s Cigar Co.', purchasedOn: '2026-02-14',
    bandColor: '#6B2C1E', foilColor: '#C89B3C',
    notes: 'Leather, cocoa nibs, a whisper of espresso on the retrohale. Third burn settles into cedar and black pepper.',
    pairing: 'Glenfiddich 18',
    smokedOn: '2026-03-02',
    flavors: ['Leather','Cedar','Cocoa','Espresso','Black Pepper'],
    thirds: {
      first: 'Hay and toasted bread, slow opening. A dusting of white pepper on the retrohale.',
      second: 'Cocoa nibs come forward, leather settles in behind. The Broadleaf sweetness arrives.',
      third: 'Espresso and cedar. Black pepper tightens the finish — long and focused.',
    },
  },
  {
    id: 'c2', name: 'Arturo Fuente Opus X', vitola: 'Perfecxion X',
    origin: 'Dominican Republic', wrapper: 'Dominican Rosado', binder: ['Dominican'], filler: ['Dominican Piloto Cubano','Dominican Olor'],
    size: '7¼ × 52', strength: 'Full',
    owned: 1, reviewed: true,
    stars: 4.6, construction: 4.5, draw: 4.3, burn: 4.8,
    price: 38.00, purchasedAt: 'Vato Cigars', purchasedOn: '2025-11-30',
    bandColor: '#1C1C1C', foilColor: '#C89B3C',
    notes: 'Spice-forward, earthy, with dried fig and a long, peppery finish. Needs an hour of your attention.',
    pairing: 'Port 10yr',
    smokedOn: '2026-01-18',
    flavors: ['Black Pepper','Loam','Fig','Raisin','Oak','Clove'],
    thirds: {
      first: 'An immediate blast of black pepper and loam. Bold opening — the Opus announces itself.',
      second: 'Dried fig and raisin emerge; the pepper recedes into oak and clove.',
      third: 'Concentrated, syrupy. Fig jam and pipe tobacco. Lingers for minutes after the ember dies.',
    },
  },
  {
    id: 'c3', name: 'Oliva Serie V Melanio', vitola: 'Figurado',
    origin: 'Nicaragua', wrapper: 'Ecuadorian Sumatra', binder: 'Nicaraguan', filler: 'Nicaraguan',
    size: '6½ × 52', strength: 'Medium-Full',
    owned: 3, reviewed: true,
    stars: 4.5, construction: 4.7, draw: 4.6, burn: 4.6,
    price: 12.75, purchasedAt: 'Famous Smoke Shop', purchasedOn: '2026-01-05',
    bandColor: '#0E3A2E', foilColor: '#C89B3C',
    notes: 'Toast, almond, baking spice. The sweet spot of the line — classic Nicaraguan profile without being brash.',
    pairing: 'Old Fashioned',
    smokedOn: '2026-02-22',
    flavors: ['Toasted Bread','Almond','Cinnamon','Cedar','Honey'],
    thirds: {
      first: 'Toast and almond, very approachable. Honey sweetness on the lips.',
      second: 'Cinnamon and baking spice wake up. The cedar is constant, anchoring.',
      third: 'Concentrates into almond skin and pepper. Stays medium-bodied throughout.',
    },
  },
  {
    id: 'c4', name: 'Montecristo No. 2', vitola: 'Pirámide',
    origin: 'Cuba', wrapper: 'Cuban', binder: 'Cuban', filler: 'Cuban',
    size: '6⅛ × 52', strength: 'Medium-Full',
    owned: 4, reviewed: false,
    stars: 0, construction: 0, draw: 0, burn: 0,
    price: 34.00, purchasedAt: 'La Casa del Habano', purchasedOn: '2026-03-12',
    bandColor: '#8B1212', foilColor: '#E9C96A',
    notes: '',
    pairing: '',
    smokedOn: null,
  },
  {
    id: 'c5', name: 'My Father Le Bijou 1922', vitola: 'Torpedo Box-Pressed',
    origin: 'Nicaragua', wrapper: 'Nicaraguan Habano Oscuro', binder: ['Nicaraguan'], filler: ['Nicaraguan Ligero','Nicaraguan Seco','Nicaraguan Viso'],
    size: '6½ × 52', strength: 'Full',
    owned: 2, reviewed: true,
    stars: 4.7, construction: 4.8, draw: 4.5, burn: 4.6,
    price: 14.50, purchasedAt: 'Neptune Cigar', purchasedOn: '2026-02-01',
    bandColor: '#111', foilColor: '#C89B3C',
    notes: 'Espresso, dark chocolate, and that rich Garcia family profile. Pressed shape burns beautifully.',
    pairing: 'Nicaraguan coffee',
    smokedOn: '2026-02-28',
    flavors: ['Espresso','Chocolate','Black Pepper','Leather','Cedar'],
    thirds: {
      first: 'Espresso from the very first puff. Pepper and cedar support.',
      second: 'Dark chocolate blooms; leather takes a seat. Full-bodied and creamy.',
      third: 'Intense, rich. Bitter chocolate and char — a proper nightcap finish.',
    },
  },
  {
    id: 'c6', name: 'Davidoff Grand Cru No. 3', vitola: 'Corona',
    origin: 'Dominican Republic', wrapper: 'Ecuadorian Connecticut', binder: 'Dominican', filler: 'Dominican',
    size: '5¼ × 43', strength: 'Mild-Medium',
    owned: 1, reviewed: false,
    stars: 0, construction: 0, draw: 0, burn: 0,
    price: 19.00, purchasedAt: 'Davidoff Madison Ave.', purchasedOn: '2026-03-20',
    bandColor: '#FFF', foilColor: '#1F4C2E',
    notes: '',
    pairing: '',
    smokedOn: null,
  },
];

// ──────────────────────────────────────────────────────────────
// ICONS (small custom set, tobacco-flavored)
// ──────────────────────────────────────────────────────────────
const Icon = {
  cigar: (c = THEME.ink, s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M2 13.5h14a4 4 0 014 4v0a4 4 0 01-4 4H2z" stroke={c} strokeWidth="1.6"/>
      <path d="M16 13.5v8" stroke={c} strokeWidth="1.4"/>
      <path d="M20 17.5h1.5" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M14 5c0 3 4 3 4 6" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M11 3c0 3 4 3 4 6" stroke={c} strokeWidth="1.4" strokeLinecap="round" opacity=".5"/>
    </svg>
  ),
  star: (filled, c = THEME.gold, s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z"
        fill={filled ? c : 'none'} stroke={c} strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  plus: (c = THEME.paper, s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  ),
  sort: (c = THEME.ink, s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M7 4v16M7 20l-3-3M7 20l3-3" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 20V4M17 4l-3 3M17 4l3 3" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  search: (c = THEME.inkSoft, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke={c} strokeWidth="1.8"/>
      <path d="M20 20l-3.5-3.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  check: (c = THEME.paper, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  close: (c = THEME.inkSoft, s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  chevron: (c = THEME.muted, s = 12) => (
    <svg width={s} height={s * 1.6} viewBox="0 0 12 20" fill="none">
      <path d="M3 3l6 7-6 7" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  flame: (c = THEME.ember, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 3c0 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4-1 4 3 4 3 0 0-2-1-4 0-6z"
        fill={c} opacity=".85"/>
    </svg>
  ),
  dollar: (c = THEME.inkSoft, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 3v18M16 7H10a3 3 0 000 6h4a3 3 0 010 6H8" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  leaf: (c = THEME.leaf, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M20 4C10 4 4 10 4 20c10 0 16-6 16-16z" fill={c} opacity=".15" stroke={c} strokeWidth="1.4"/>
      <path d="M4 20L16 8" stroke={c} strokeWidth="1.2"/>
    </svg>
  ),
  pin: (c = THEME.inkSoft, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" stroke={c} strokeWidth="1.5"/>
      <circle cx="12" cy="10" r="2.5" stroke={c} strokeWidth="1.5"/>
    </svg>
  ),
};

Object.assign(window, { THEME, SAMPLE_CIGARS, Icon });
