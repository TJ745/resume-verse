// Shared constants — no "use client", safe to import from server and client components

export const TEMPLATES: { id: string; label: string; description: string }[] = [
  {
    id: "modern",
    label: "Modern",
    description: "Accent bar, left-aligned header",
  },
  {
    id: "classic",
    label: "Classic",
    description: "Centered header, ruled sections",
  },
  { id: "minimal", label: "Minimal", description: "Two-column sidebar layout" },
  {
    id: "executive",
    label: "Executive",
    description: "Bold name, wide margins, formal",
  },
  {
    id: "compact",
    label: "Compact",
    description: "Dense layout, fits more content",
  },
  {
    id: "creative",
    label: "Creative",
    description: "Left color sidebar, modern feel",
  },
  {
    id: "elegant",
    label: "Elegant",
    description: "Serif-heavy, refined spacing",
  },
  {
    id: "technical",
    label: "Technical",
    description: "Clean grid, perfect for engineers",
  },
  {
    id: "chronological",
    label: "Chronological",
    description: "Timeline-style experience section",
  },
  {
    id: "bold",
    label: "Bold",
    description: "High-contrast, strong typography",
  },
];

export const COLOR_SCHEMES: {
  id: string;
  label: string;
  accent: string;
  bg: string;
  text: string;
  swatch: string;
}[] = [
  {
    id: "terracotta",
    label: "Terracotta",
    accent: "#c84b2f",
    bg: "#fdfcfa",
    text: "#0f0e0d",
    swatch: "#c84b2f",
  },
  {
    id: "navy",
    label: "Navy",
    accent: "#1e3a5f",
    bg: "#fafbfc",
    text: "#0d1117",
    swatch: "#1e3a5f",
  },
  {
    id: "forest",
    label: "Forest",
    accent: "#2d5a3d",
    bg: "#fafcfa",
    text: "#0d1a10",
    swatch: "#2d5a3d",
  },
  {
    id: "slate",
    label: "Slate",
    accent: "#4a5568",
    bg: "#fafafa",
    text: "#1a202c",
    swatch: "#4a5568",
  },
  {
    id: "plum",
    label: "Plum",
    accent: "#6b3fa0",
    bg: "#fdfaff",
    text: "#1a0a2e",
    swatch: "#6b3fa0",
  },
  {
    id: "gold",
    label: "Gold",
    accent: "#b7791f",
    bg: "#fffdf7",
    text: "#1a1400",
    swatch: "#b7791f",
  },
  {
    id: "rose",
    label: "Rose",
    accent: "#be3455",
    bg: "#fdfafa",
    text: "#1a0810",
    swatch: "#be3455",
  },
  {
    id: "teal",
    label: "Teal",
    accent: "#0d7377",
    bg: "#f7fcfc",
    text: "#021a1b",
    swatch: "#0d7377",
  },
  {
    id: "charcoal",
    label: "Charcoal",
    accent: "#2d2d2d",
    bg: "#fafafa",
    text: "#111111",
    swatch: "#2d2d2d",
  },
  {
    id: "crimson",
    label: "Crimson",
    accent: "#9b1c1c",
    bg: "#fffafa",
    text: "#1a0000",
    swatch: "#9b1c1c",
  },
];
