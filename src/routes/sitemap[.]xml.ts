import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BLOG_POSTS } from "@/lib/blog";

// Single-page site — most navigation is hash-anchor based on "/".
// Admin/dashboard/login pages are intentionally excluded (private).
const entries = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/motorcycle-lessons-ashkelon", changefreq: "weekly", priority: "0.9" },
  { path: "/car-lessons-ashkelon", changefreq: "weekly", priority: "0.9" },
  { path: "/motorcycle-license-a2-ashkelon", changefreq: "monthly", priority: "0.8" },
  { path: "/motorcycle-license-a1-ashkelon", changefreq: "monthly", priority: "0.8" },
  { path: "/motorcycle-license-a-ashkelon", changefreq: "monthly", priority: "0.8" },
  { path: "/motorcycle-license-process", changefreq: "monthly", priority: "0.7" },
  { path: "/motorcycle-test-ashkelon", changefreq: "monthly", priority: "0.7" },
  { path: "/useful-links", changefreq: "monthly", priority: "0.6" },
  { path: "/blog", changefreq: "weekly", priority: "0.6" },
  ...BLOG_POSTS.map((p) => ({ path: `/blog/${p.slug}`, changefreq: "monthly", priority: "0.5" })),
  { path: "/accessibility", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const base = `${url.protocol}//${url.host}`;
        const today = new Date().toISOString().slice(0, 10);

        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${base}${e.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});