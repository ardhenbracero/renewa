import { SUBSCRIPTION_RELEVANT_ICONS } from "@/constants/subscription-relevant-icons";
import * as simpleIcons from "simple-icons";

export type BrandIconEntry = {
  slug: string;
  title: string;
  hex: string;
  category: string;
};

function buildFullList(): Omit<BrandIconEntry, "category">[] {
  return Object.keys(simpleIcons)
    .filter((key) => key.startsWith("si"))
    .map((key) => {
      const icon = (simpleIcons as any)[key];
      return { slug: icon.slug, title: icon.title, hex: icon.hex };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

const FULL_LIST = buildFullList();
const categoryBySlug = new Map(
  SUBSCRIPTION_RELEVANT_ICONS.map(
    (i) => [i.slug, i.category] as [string, string],
  ),
);

// Curated, subscription-relevant icons with real categories — shown by default
export const CURATED_BRAND_ICONS: BrandIconEntry[] = FULL_LIST.filter((icon) =>
  categoryBySlug.has(icon.slug),
).map((icon) => ({
  ...icon,
  category: categoryBySlug.get(icon.slug)!,
}));

// Every icon in simple-icons — used as a fallback when search comes up empty.
// No real category data available here, so default to "Other".
export const ALL_BRAND_ICONS: BrandIconEntry[] = FULL_LIST.map((icon) => ({
  ...icon,
  category: categoryBySlug.get(icon.slug) ?? "Other",
}));
