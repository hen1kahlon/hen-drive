import { createFileRoute, Link } from "@tanstack/react-router";
import { GuidePage } from "@/components/GuidePage";
import { BLOG_POSTS } from "@/lib/blog";

const URL = "https://hendrive.co.il/blog";
const TITLE = "בלוג – טיפים לרישיון אופנוע ורכב | חן כחלון, אשקלון";
const DESC = "טיפים ממורה נהיגה לאופנוע באשקלון: מבחן השליטה, השמיניות, מעגלי תנועה, טסט חוץ ואיזה רישיון מתאים לכם.";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "he_IL" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <GuidePage
      eyebrow="בלוג · טיפים מהמגרש ומהכביש"
      title="טיפים לרישיון אופנוע"
      intro="מה שאני מסביר לתלמידים בשיעורים – כתוב, עם הסרטונים מהמגרש ומהכביש."
      waMessage="היי חן, קראתי בבלוג ואשמח לפרטים על שיעורים"
      related={[
        { to: "/motorcycle-test-ashkelon", title: "טסט לאופנוע – מה מצפה לך" },
        { to: "/motorcycle-license-process", title: "איך מוציאים רישיון – שלב אחר שלב" },
      ]}
    >
      <ul className="!list-none !pr-0 grid gap-4 sm:grid-cols-2">
        {BLOG_POSTS.map((p) => (
          <li key={p.slug}>
            <Link
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="!no-underline block h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition-colors"
            >
              <h2 className="!mt-0 !mb-2 !text-lg">{p.title}</h2>
              <p className="text-sm text-muted-foreground">{p.description}</p>
              <span className="mt-3 inline-block text-sm font-bold text-primary">לקריאה ←</span>
            </Link>
          </li>
        ))}
      </ul>
    </GuidePage>
  );
}
