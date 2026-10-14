/**
 * Artwork for desktop file icons (44×44 tiles) and dock buttons (24×24 strokes),
 * taken from the "Portfolio Desktop" design. Keyed by window id.
 */

type Tile = { bg: string; art: React.ReactNode };

const S = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const TILES: Record<string, Tile> = {
  about: {
    bg: "#ffffff",
    art: (
      <>
        <rect x="8" y="10" width="28" height="3" fill="#1A1A1A" />
        <rect x="8" y="17" width="22" height="2" fill="#9A9A96" />
        <rect x="8" y="22" width="26" height="2" fill="#9A9A96" />
        <rect x="8" y="27" width="18" height="2" fill="#9A9A96" />
        <rect x="8" y="32" width="24" height="2" fill="#9A9A96" />
      </>
    ),
  },
  dfk: {
    bg: "#0E1B4D",
    art: (
      <>
        {[12, 22, 32].map((cx) => <circle key={`a${cx}`} cx={cx} cy="12" r="3" fill="#ffffff" />)}
        <circle cx="12" cy="22" r="3" fill="#ffffff" />
        <circle cx="22" cy="22" r="4" fill="#FF5A1F" />
        <circle cx="32" cy="22" r="3" fill="#ffffff" />
        {[12, 22, 32].map((cx) => <circle key={`c${cx}`} cx={cx} cy="32" r="3" fill="#6D78A8" />)}
      </>
    ),
  },
  mtla: {
    bg: "#E8E3F7",
    art: (
      <>
        <circle cx="22" cy="22" r="16" fill="none" stroke="#2B1F6B" strokeWidth="2" />
        <circle cx="22" cy="22" r="10" fill="none" stroke="#2B1F6B" strokeWidth="2" />
        <circle cx="22" cy="22" r="4" fill="#2B1F6B" />
      </>
    ),
  },
  shooter: {
    bg: "#111111",
    art: (
      <g stroke="#E5372B" strokeWidth="2">
        <circle cx="22" cy="22" r="11" fill="none" />
        <line x1="22" y1="4" x2="22" y2="16" />
        <line x1="22" y1="28" x2="22" y2="40" />
        <line x1="4" y1="22" x2="16" y2="22" />
        <line x1="28" y1="22" x2="40" y2="22" />
      </g>
    ),
  },
  arena: {
    bg: "#F2F2EE",
    art: (
      <>
        <path d="M11 0V44M22 0V44M33 0V44M0 11H44M0 22H44M0 33H44" stroke="#D2D2CC" strokeWidth="1" />
        <rect x="22" y="11" width="11" height="11" fill="#1A1A1A" />
        <rect x="0" y="22" width="11" height="11" fill="#1A1A1A" />
        <polyline points="5,39 16,39 16,27 27,27 27,5 39,5" fill="none" stroke="#FF5A1F" strokeWidth="2.5" />
      </>
    ),
  },
  hiring: {
    bg: "#FFE6DA",
    art: (
      <>
        <path d="M9 12 22 22M9 22H22M9 32 22 22M22 22 35 15M22 22 35 29" stroke="#B93A0C" strokeWidth="1.5" />
        {[12, 22, 32].map((cy) => <circle key={cy} cx="9" cy={cy} r="3" fill="#ffffff" stroke="#B93A0C" strokeWidth="1.5" />)}
        <circle cx="22" cy="22" r="4" fill="#FF5A1F" />
        <circle cx="35" cy="15" r="3" fill="#1A1A1A" />
        <circle cx="35" cy="29" r="3" fill="#1A1A1A" />
      </>
    ),
  },
  timeline: {
    bg: "#ffffff",
    art: (
      <>
        <path d="M6 9H38M6 18H38M6 27H38M6 36H38" stroke="#E4E4DF" strokeWidth="1" />
        <rect x="8" y="7" width="12" height="4" rx="1" fill="#C3C7BF" />
        <rect x="16" y="16" width="14" height="4" rx="1" fill="#80857D" />
        <rect x="22" y="25" width="8" height="4" rx="1" fill="#FF5A1F" />
        <rect x="28" y="34" width="10" height="4" rx="1" fill="#1A1A1A" />
      </>
    ),
  },
  "komdigi-ml": {
    bg: "#1F4D3A",
    art: (
      <>
        <rect x="8" y="26" width="5" height="10" fill="#ffffff" />
        <rect x="16" y="20" width="5" height="16" fill="#ffffff" />
        <rect x="24" y="14" width="5" height="22" fill="#ffffff" />
        <rect x="32" y="8" width="5" height="28" fill="#B9F2C9" />
      </>
    ),
  },
  finetuning: {
    bg: "#FFF7D6",
    art: (
      <>
        <path d="M6 6V38H40" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
        <polyline points="8,10 14,20 20,24 26,29 32,31 38,32" fill="none" stroke="#C2410C" strokeWidth="2.5" />
      </>
    ),
  },
  pelni: {
    bg: "#0B5FA5",
    art: (
      <>
        <path d="M0 18 Q11 12 22 18 T44 18" fill="none" stroke="#ffffff" strokeWidth="2" />
        <path d="M0 26 Q11 20 22 26 T44 26" fill="none" stroke="#ffffff" strokeWidth="2" />
        <path d="M0 34 Q11 28 22 34 T44 34" fill="none" stroke="#9CC9F0" strokeWidth="2" />
      </>
    ),
  },
  "komdigi-it": {
    bg: "#1C1C1C",
    art: (
      <>
        <polyline points="9,15 16,22 9,29" fill="none" stroke="#7CFFB2" strokeWidth="2.5" />
        <rect x="20" y="28" width="14" height="3" fill="#7CFFB2" />
      </>
    ),
  },
  toolkit: {
    bg: "#F6F6F3",
    art: (
      <>
        <rect x="7" y="7" width="16" height="16" fill="#1A1A1A" />
        <rect x="21" y="13" width="16" height="16" fill="#FF5A1F" />
        <rect x="12" y="23" width="16" height="16" fill="#2F6BFF" />
      </>
    ),
  },
  elite: {
    bg: "#C8232B",
    art: <polygon points="22,7 26,18 37,18 28,25 31,36 22,29 13,36 16,25 7,18 18,18" fill="#ffffff" />,
  },
  inclenation: {
    bg: "#FFD23F",
    art: (
      <>
        <circle cx="22" cy="22" r="13" fill="#1A1A1A" />
        <path d="M22 9 A13 13 0 0 1 22 35 Z" fill="#ffffff" />
      </>
    ),
  },
  ideas: {
    bg: "#ffffff",
    art: (
      <>
        <circle cx="22" cy="18" r="9" fill="none" stroke="#1A1A1A" strokeWidth="2.5" />
        <rect x="18" y="29" width="8" height="3" fill="#1A1A1A" />
        <rect x="19" y="34" width="6" height="2" fill="#1A1A1A" />
        <g stroke="#FF5A1F" strokeWidth="2">
          <line x1="22" y1="3" x2="22" y2="6" />
          <line x1="8" y1="10" x2="10" y2="12" />
          <line x1="36" y1="10" x2="34" y2="12" />
        </g>
      </>
    ),
  },
  schematics: {
    bg: "#0A0A0A",
    art: (
      <>
        <path d="M6 12H18V22H30V32H38M6 30H14V38M26 6V14H38" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="18" cy="12" r="2.5" fill="#ffffff" />
        <circle cx="30" cy="22" r="2.5" fill="#ffffff" />
        <circle cx="26" cy="14" r="2.5" fill="#ffffff" />
      </>
    ),
  },
  pasar: {
    bg: "#E87A1E",
    art: (
      <>
        <polygon points="4,36 15,16 26,36" fill="#ffffff" />
        <polygon points="18,36 29,12 40,36" fill="#FFE3C7" />
      </>
    ),
  },
  "cert-ai": {
    bg: "#EDEDEA",
    art: (
      <>
        <polygon points="16,26 12,40 18,37 22,41 22,28" fill="#FF5A1F" />
        <polygon points="28,26 32,40 26,37 22,41 22,28" fill="#C2410C" />
        <circle cx="22" cy="18" r="11" fill="#1A1A1A" />
        <circle cx="22" cy="18" r="6" fill="none" stroke="#ffffff" strokeWidth="1.5" />
      </>
    ),
  },
  "cert-ds": {
    bg: "#12324A",
    art: (
      <>
        {[
          [10, 32],
          [16, 27],
          [20, 30],
          [26, 20],
          [31, 17],
          [36, 11],
        ].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="2.5" fill="#ffffff" />)}
        <line x1="6" y1="36" x2="40" y2="8" stroke="#7FD1FF" strokeWidth="1.5" />
      </>
    ),
  },
  "cert-aws": {
    bg: "#F5F5F2",
    art: (
      <>
        <path d="M22 6 L35 11 V21 C35 30 29 36 22 39 C15 36 9 30 9 21 V11 Z" fill="#1A1A1A" />
        <polyline points="16,22 20,26 28,17" fill="none" stroke="#ffffff" strokeWidth="2.5" />
      </>
    ),
  },
  photos: {
    bg: "#0F766E",
    art: (
      <>
        <rect x="8" y="10" width="28" height="24" fill="none" stroke="#ffffff" strokeWidth="2" />
        <circle cx="29" cy="17" r="2.5" fill="#FFD166" />
        <path d="M10 32 L19 21 L25 28 L28 25 L34 32 Z" fill="#ffffff" />
      </>
    ),
  },
  cv: {
    bg: "#ffffff",
    art: (
      <>
        <path d="M11 5H27L34 12V39H11Z" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
        <path d="M27 5V12H34" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
        <rect x="15" y="27" width="15" height="7" fill="#E5372B" />
      </>
    ),
  },
  contact: {
    bg: "#2F6BFF",
    art: (
      <>
        <rect x="8" y="12" width="28" height="20" fill="none" stroke="#ffffff" strokeWidth="2" />
        <polyline points="8,12 22,24 36,12" fill="none" stroke="#ffffff" strokeWidth="2" />
      </>
    ),
  },
};

/** A 44×44 file-icon tile. Falls back to a plain document for ids without artwork. */
export function TileArt({ id, size = 42 }: { id: string; size?: number }) {
  const t = TILES[id] ?? TILES.about;
  return (
    <svg viewBox="0 0 44 44" width={size} height={size} aria-hidden="true">
      <rect width="44" height="44" fill={t.bg} />
      {t.art}
    </svg>
  );
}

type DockGlyph = { bg: string; fg: string; art: React.ReactNode };

export const DOCK_GLYPHS: Record<string, DockGlyph> = {
  about: {
    bg: "#F2C14E",
    fg: "#111111",
    art: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
      </>
    ),
  },
  projects: { bg: "#0E1B4D", fg: "#ffffff", art: <path d="M3 7h6l2 2h10v10H3z" /> },
  experience: {
    bg: "#1F4D3A",
    fg: "#ffffff",
    art: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5h6v2M3 13h18" />
      </>
    ),
  },
  organizations: {
    bg: "#C8232B",
    fg: "#ffffff",
    art: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20c.8-3.5 3-5 6-5s5.2 1.5 6 5M15 15.5c2.6 0 4.4 1.3 5 4.5" />
      </>
    ),
  },
  certificates: {
    bg: "#ffffff",
    fg: "#111111",
    art: (
      <>
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 14 7 22l5-3 5 3-1.5-8" />
      </>
    ),
  },
  photos: {
    bg: "#0F766E",
    fg: "#ffffff",
    art: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="16" cy="9.5" r="1.5" />
        <path d="m3 16 5-5 4 4 2.5-2.5L21 18" />
      </>
    ),
  },
  github: {
    bg: "#161616",
    fg: "#ffffff",
    art: (
      <>
        <circle cx="6" cy="5" r="2" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="7" r="2" />
        <path d="M6 7v10M18 9c0 5-6 4-11 8.5" />
      </>
    ),
  },
  linkedin: {
    bg: "#0A66C2",
    fg: "#ffffff",
    art: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="11" r="2" />
        <path d="M5.8 16.5c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M14.5 10h4M14.5 13.5h3" />
      </>
    ),
  },
  contact: {
    bg: "#2F6BFF",
    fg: "#ffffff",
    art: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
  closeAll: { bg: "#E4E4E0", fg: "#111111", art: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /> },
};

/** Stroke icon for a dock button (or a desktop tile for windows without a dock glyph). */
export function DockArt({ id }: { id: string }) {
  const g = DOCK_GLYPHS[id];
  if (!g) return <TileArt id={id} size={30} />;
  return (
    <svg viewBox="0 0 24 24" width="55%" height="55%" stroke={g.fg} strokeWidth="1.8" {...S} aria-hidden="true">
      {g.art}
    </svg>
  );
}

export function dockBg(id: string) {
  return DOCK_GLYPHS[id]?.bg ?? "#ffffff";
}
