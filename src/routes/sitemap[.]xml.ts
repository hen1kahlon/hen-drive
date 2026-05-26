import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Public pages only — admin/auth/dashboard are intentionally excluded.
const entries = [
  {
    path: "/",
    changefreq: "weekly",
    priority: "1.0",
    images: [
      { loc: "https://hendrive.co.il/og-image.jpg", title: "חן כחלון – מורה נהיגה אשקלון" },
    ],
  },
  {
    path: "/car-lessons-ashkelon",
    changefreq: "weekly",
    priority: "0.9",
    images: [
      { loc: "https://hendrive.co.il/assets/vehicle-sedan.webp", title: "שיעורי נהיגה לרכב אשקלון – חן כחלון" },
    ],
  },
  {
    path: "/motorcycle-lessons-ashkelon",
    changefreq: "weekly",
    priority: "0.9",
    images: [
      { loc: "https://hendrive.co.il/assets/vehicle-bike-a.webp", title: "שיעורי אופנוע אשקלון – חן כחלון" },
    ],
  },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const base = `${url.protocol}//${url.host}`;
        const today = new Date().toISOString().slice(0, 10);

        const urlNodes = entries
          .map((e) => {
            const imageNodes = e.images
              .map(
                (img) =>
                  `    <image:image>\n      <image:loc>${img.loc}</image:loc>\n      <image:title>${img.title}</image:title>\n    </image:image>`,
              )
              .join("\n");
            return `  <url>\n    <loc>${base}${e.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n${imageNodes}\n  </url>`;
          })
          .join("\n");

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset`,
          `  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
          `  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`,
          `  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`,
          `  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9`,
          `    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`,
          urlNodes,
          `</urlset>`,
        ].join("\n");

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
