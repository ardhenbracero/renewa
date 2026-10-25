/* eslint-disable */
// Generates src/constants/service-catalog.ts: the list of known subscription
// services shown in Quick pick and the service picker.
//
// Logos come from two CC0 sources and are copied into the generated file, so
// the app ships only the ~60 shapes it needs (no runtime icon library):
//   - simple-icons (installed): one-color glyphs, drawn white on the brand color
//   - Iconify "logos" set: full-color logos for brands simple-icons dropped
// Brands with no free logo (Disney+, Canva...) get a lettered tile instead.
//
// Usage:
//   npm pack @iconify-json/logos && tar xzf iconify-json-logos-*.tgz
//   node scripts/build-service-catalog.js <path to extracted "package" folder>
// Edit SERVICES below, then re-run. Categories must match constants/categories.ts.

const fs = require("fs");
const path = require("path");
const si = require("simple-icons");

const iconifyDir = process.argv[2];
if (!iconifyDir) {
  console.error("Pass the extracted @iconify-json/logos package folder.");
  process.exit(1);
}
const iconify = JSON.parse(
  fs.readFileSync(path.join(iconifyDir, "icons.json"), "utf8"),
);

// [id, name, category, source]
//   { si: slug }                         simple-icons glyph (color = brand hex)
//   { logo: iconifyName, color }         Iconify full-color logo on white
//   { text, color, fg? }                 lettered tile (fg defaults to white)
// The id is what gets saved as a subscription's iconSlug. Never rename an id
// that has shipped, or saved subscriptions lose their logo.
const SERVICES = [
  // Entertainment
  ["netflix", "Netflix", "Entertainment", { si: "netflix" }],
  ["youtube", "YouTube Premium", "Entertainment", { si: "youtube" }],
  ["disneyplus", "Disney+", "Entertainment", { text: "D+", color: "#113CCF" }],
  ["primevideo", "Prime Video", "Entertainment", { text: "PV", color: "#00A8E1" }],
  ["max", "Max", "Entertainment", { si: "max" }],
  ["appletv", "Apple TV+", "Entertainment", { si: "appletv" }],
  ["crunchyroll", "Crunchyroll", "Entertainment", { si: "crunchyroll" }],
  ["paramountplus", "Paramount+", "Entertainment", { si: "paramountplus" }],
  ["hulu", "Hulu", "Entertainment", { text: "hulu", color: "#1CE783", fg: "#0B0C0F" }],
  ["peacock", "Peacock", "Entertainment", { text: "P", color: "#000000" }],
  ["viu", "Viu", "Entertainment", { text: "Viu", color: "#F5B400", fg: "#111111" }],
  ["iqiyi", "iQIYI", "Entertainment", { text: "iQ", color: "#00C800" }],
  ["plex", "Plex Pass", "Entertainment", { si: "plex" }],
  ["twitch", "Twitch", "Entertainment", { si: "twitch" }],

  // Music
  ["spotify", "Spotify", "Music", { si: "spotify" }],
  ["applemusic", "Apple Music", "Music", { si: "applemusic" }],
  ["youtubemusic", "YouTube Music", "Music", { si: "youtubemusic" }],
  ["tidal", "Tidal", "Music", { si: "tidal" }],
  ["deezer", "Deezer", "Music", { si: "deezer" }],
  ["soundcloud", "SoundCloud Go+", "Music", { si: "soundcloud" }],
  ["pandora", "Pandora", "Music", { si: "pandora" }],

  // Cloud & Storage
  ["icloud", "iCloud+", "Cloud & Storage", { si: "icloud" }],
  ["googleone", "Google One", "Cloud & Storage", { logo: "google-one", color: "#4285F4" }],
  ["dropbox", "Dropbox", "Cloud & Storage", { si: "dropbox" }],
  ["onedrive", "OneDrive", "Cloud & Storage", { logo: "microsoft-onedrive", color: "#0078D4" }],

  // Productivity
  ["microsoft365", "Microsoft 365", "Productivity", { logo: "microsoft-icon", color: "#F25022" }],
  ["canva", "Canva", "Productivity", { text: "C", color: "#00C4CC" }],
  ["adobe", "Adobe Creative Cloud", "Productivity", { logo: "adobe-icon", color: "#FA0F00" }],
  ["notion", "Notion", "Productivity", { si: "notion" }],
  ["figma", "Figma", "Productivity", { si: "figma" }],
  ["evernote", "Evernote", "Productivity", { si: "evernote" }],
  ["todoist", "Todoist", "Productivity", { si: "todoist" }],
  ["grammarly", "Grammarly", "Productivity", { si: "grammarly" }],
  ["linkedin", "LinkedIn Premium", "Productivity", { logo: "linkedin-icon", color: "#0A66C2" }],
  ["duolingo", "Duolingo Super", "Productivity", { si: "duolingo" }],

  // AI Tools
  ["chatgpt", "ChatGPT Plus", "AI Tools", { logo: "openai-icon", color: "#10A37F" }],
  ["claude", "Claude Pro", "AI Tools", { si: "claude" }],
  ["googlegemini", "Gemini Advanced", "AI Tools", { si: "googlegemini" }],
  ["perplexity", "Perplexity Pro", "AI Tools", { si: "perplexity" }],
  ["githubcopilot", "GitHub Copilot", "AI Tools", { si: "githubcopilot" }],
  ["midjourney", "Midjourney", "AI Tools", { text: "M", color: "#000000" }],

  // Gaming
  ["playstation", "PlayStation Plus", "Gaming", { si: "playstation" }],
  ["xbox", "Xbox Game Pass", "Gaming", { text: "X", color: "#107C10" }],
  ["nintendo", "Nintendo Switch Online", "Gaming", { text: "N", color: "#E60012" }],
  ["steam", "Steam", "Gaming", { si: "steam" }],
  ["applearcade", "Apple Arcade", "Gaming", { si: "applearcade" }],

  // Health
  ["strava", "Strava", "Health", { si: "strava" }],
  ["headspace", "Headspace", "Health", { si: "headspace" }],
  ["calm", "Calm", "Health", { text: "Calm", color: "#2A6DD6" }],

  // News & Reading
  ["audible", "Audible", "News & Reading", { si: "audible" }],
  ["kindleunlimited", "Kindle Unlimited", "News & Reading", { text: "KU", color: "#146EB4" }],
  ["medium", "Medium", "News & Reading", { si: "medium" }],
  ["substack", "Substack", "News & Reading", { si: "substack" }],

  // Shopping
  ["amazonprime", "Amazon Prime", "Shopping", { text: "prime", color: "#00A8E1" }],

  // Security
  ["1password", "1Password", "Security", { si: "1password" }],
  ["bitwarden", "Bitwarden", "Security", { si: "bitwarden" }],
  ["nordvpn", "NordVPN", "Security", { si: "nordvpn" }],
  ["expressvpn", "ExpressVPN", "Security", { si: "expressvpn" }],
  ["protonvpn", "Proton VPN", "Security", { si: "protonvpn" }],

  // Developer Tools
  ["github", "GitHub", "Developer Tools", { si: "github" }],

  // Communication
  ["slack", "Slack", "Communication", { logo: "slack-icon", color: "#4A154B" }],
  ["discord", "Discord Nitro", "Communication", { si: "discord" }],
  ["zoom", "Zoom", "Communication", { si: "zoom" }],
  ["x", "X Premium", "Communication", { si: "x" }],

  // Other
  ["patreon", "Patreon", "Other", { si: "patreon" }],
];

// Old iconSlugs saved by the previous picker that now map to a catalog entry
const ALIASES = { hbomax: "max", openai: "chatgpt", youtubepremium: "youtube" };

const CATEGORIES = [
  "Entertainment", "Music", "Productivity", "Cloud & Storage", "Health",
  "AI Tools", "Gaming", "News & Reading", "Shopping", "Security",
  "Developer Tools", "Communication", "Other",
];

const siBySlug = new Map(
  Object.values(si).filter((x) => x && x.slug).map((x) => [x.slug, x]),
);
const seen = new Set();

const entries = SERVICES.map(([id, name, category, src]) => {
  if (seen.has(id)) throw new Error(`Duplicate id: ${id}`);
  seen.add(id);
  if (!CATEGORIES.includes(category)) throw new Error(`Bad category for ${id}`);

  if (src.si) {
    const icon = siBySlug.get(src.si);
    if (!icon) throw new Error(`simple-icons has no "${src.si}"`);
    return { id, name, category, color: `#${icon.hex}`, logo: { kind: "glyph", path: icon.path } };
  }
  if (src.logo) {
    const icon = iconify.icons[src.logo];
    if (!icon) throw new Error(`Iconify logos has no "${src.logo}"`);
    const w = icon.width || iconify.width;
    const h = icon.height || iconify.height;
    const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${icon.body}</svg>`;
    return { id, name, category, color: src.color, logo: { kind: "svg", xml } };
  }
  const logo = { kind: "text", text: src.text };
  if (src.fg) logo.fg = src.fg;
  return { id, name, category, color: src.color, logo };
});

const out = `// GENERATED by scripts/build-service-catalog.js. Do not edit by hand:
// change SERVICES in that script and re-run it.
// Logo data: simple-icons (CC0) and Iconify "logos" by Gil Barbara (CC0).

export type ServiceLogo =
  | { kind: "glyph"; path: string } // 24x24 one-color path, drawn white
  | { kind: "svg"; xml: string } // full-color logo, drawn on white
  | { kind: "text"; text: string; fg?: string }; // lettered tile

export type ServiceEntry = {
  id: string; // saved as the subscription's iconSlug
  name: string;
  category: string;
  color: string; // brand color: tile background, calendar dot
  logo: ServiceLogo;
};

export const SERVICE_CATALOG: ServiceEntry[] = ${JSON.stringify(entries, null, 2)};

const byId = new Map(SERVICE_CATALOG.map((s) => [s.id, s]));
const ALIASES: Record<string, string> = ${JSON.stringify(ALIASES)};

// Case-insensitive, with aliases, so slugs saved by the old picker still resolve
export function getService(id: string | null | undefined): ServiceEntry | undefined {
  if (!id) return undefined;
  const key = id.toLowerCase();
  return byId.get(ALIASES[key] ?? key);
}
`;

const target = path.join(__dirname, "..", "src", "constants", "service-catalog.ts");
fs.writeFileSync(target, out);
console.log(`Wrote ${entries.length} services to ${path.relative(process.cwd(), target)}`);
