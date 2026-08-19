import { siteConfig } from "@/lib/config";

export type BreadcrumbItem = { label: string; path: string };

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.path, siteConfig.site.url).toString(),
    })),
  } as const;
}
