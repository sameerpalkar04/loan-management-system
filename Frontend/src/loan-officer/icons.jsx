// ============================================================
// Setu Credit — icons (no icon library needed)
// ============================================================
const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
};

export const QueueIcon = () => (
  <svg {...base}>
    <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
    <path d="M5 6.5h6M5 9.5h4" />
  </svg>
);

export const BureauIcon = () => (
  <svg {...base}>
    <path d="M2 13.5h12M3.5 13.5V7M6.5 13.5V4.5M9.5 13.5V9M12.5 13.5V2.5" />
  </svg>
);

export const CatalogIcon = () => (
  <svg {...base}>
    <rect x="2" y="2.5" width="5" height="5" rx="1" />
    <rect x="9" y="2.5" width="5" height="5" rx="1" />
    <rect x="2" y="9.5" width="5" height="4" rx="1" />
    <rect x="9" y="9.5" width="5" height="4" rx="1" />
  </svg>
);

export const ManageIcon = () => (
  <svg {...base}>
    <circle cx="8" cy="8" r="2.2" />
    <path d="M8 1.8v1.6M8 12.6v1.6M14.2 8h-1.6M3.4 8H1.8M12.4 3.6l-1.1 1.1M4.7 11.3l-1.1 1.1M12.4 12.4l-1.1-1.1M4.7 4.7 3.6 3.6" />
  </svg>
);

export const CloseIcon = () => (
  <svg {...base} strokeWidth={1.6}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);

export const SunIcon = () => (
  <svg {...base} strokeWidth={1.4}>
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1v1.5M8 13.5V15M15 8h-1.5M2.5 8H1M12.9 3.1l-1 1M4.1 11.9l-1 1M12.9 12.9l-1-1M4.1 4.1l-1-1" />
  </svg>
);

/** 300–900 credit-score arc. */
export function ScoreArc({ score, color }) {
  const pct = Math.max(0, Math.min(1, (score - 300) / 600));
  const r = 42;
  const c = Math.PI * r;
  const offset = c * (1 - pct);
  return (
    <svg width="108" height="66" viewBox="0 0 108 66" aria-hidden="true">
      <path d="M12 58 A42 42 0 0 1 96 58" fill="none" stroke="var(--line)" strokeWidth="9" strokeLinecap="round" />
      <path
        d="M12 58 A42 42 0 0 1 96 58"
        fill="none"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
      <text x="12" y="66" fontSize="9" fill="var(--muted)">300</text>
      <text x="86" y="66" fontSize="9" fill="var(--muted)">900</text>
    </svg>
  );
}
