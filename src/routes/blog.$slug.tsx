import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { GuidePage } from "@/components/GuidePage";
import { TikTokEmbed } from "@/components/TikTokEmbed";
import { getPost } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = `https://hendrive.co.il/blog/${loaderData.slug}`;
    const title = `${loaderData.title} | חן כחלון`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { name: "robots", content: "index, follow" },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
        { property: "og:url", content: url },
        { property: "og:locale", content: "he_IL" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: loaderData.title,
            description: loaderData.description,
            datePublished: loaderData.date,
            inLanguage: "he",
            mainEntityOfPage: url,
            author: { "@type": "Person", name: "חן כחלון" },
          }),
        },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  return (
    <GuidePage
      eyebrow="בלוג · חן כחלון"
      title={post.title}
      intro={post.description}
      waMessage={`היי חן, קראתי את "${post.title}" ואשמח לפרטים`}
      related={[{ to: "/blog", title: "כל הכתבות בבלוג" }, ...post.related]}
    >
      {post.videoId && (
        <figure className="mx-auto max-w-[300px]">
          <TikTokEmbed id={post.videoId} title={post.videoTitle ?? post.title} />
          {post.videoTitle && <figcaption className="mt-2 text-center text-sm font-bold">{post.videoTitle}</figcaption>}
        </figure>
      )}
      {post.sections.map((s, i) => (
        <section key={i}>
          {s.h && <h2>{s.h}</h2>}
          {s.p?.map((t, j) => <p key={j} className="mb-3">{t}</p>)}
          {s.list && (
            <ul>
              {s.list.map((t, j) => <li key={j}>{t}</li>)}
            </ul>
          )}
        </section>
      ))}
      <p>
        <Link to="/blog">← לכל הכתבות</Link>
      </p>
    </GuidePage>
  );
}
