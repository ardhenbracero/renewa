import { SUBSCRIPTION_RELEVANT_SLUGS } from "@/constants/subscription-relevant-icons";
import * as simpleIcons from "simple-icons";

export type BrandIconEntry = {
  slug: string;
  title: string;
  hex: string;
};

function buildFullList(): BrandIconEntry[] {
  return Object.keys(simpleIcons)
    .filter((key) => key.startsWith("si"))
    .map((key) => {
      const icon = (simpleIcons as any)[key];
      return { slug: icon.slug, title: icon.title, hex: icon.hex };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

const FULL_LIST = buildFullList();
const allowlistSet = new Set(SUBSCRIPTION_RELEVANT_SLUGS);

// Curated, subscription-relevant icons — shown by default
export const CURATED_BRAND_ICONS: BrandIconEntry[] = FULL_LIST.filter((icon) =>
  allowlistSet.has(icon.slug),
);

// Every icon in simple-icons — used as a fallback when search comes up empty
export const ALL_BRAND_ICONS: BrandIconEntry[] = FULL_LIST;
