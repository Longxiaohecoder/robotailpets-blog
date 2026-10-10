import type { CollectionEntry } from "astro:content";

export const topics = ["Cat-Friendly Homes", "Life with Cats", "Product Guides"];
export function topicOf(post: CollectionEntry<"posts">) {
  const legacy = { "温馨家居": topics[0], "相处日常": topics[1], "用品选择": topics[2] };
  if (post.data.category) return legacy[post.data.category as keyof typeof legacy] || post.data.category;
  const tags = post.data.tags.join(" ");
  if (/cat-friendly|interior|home design|家居|空间|布置/i.test(tags)) return topics[0];
  if (/companionship|routines|life with cats|陪伴|日常|相处/i.test(tags)) return topics[1];
  return topics[2];
}
export function coverOf(post: CollectionEntry<"posts">) {
  if (post.data.cover) return post.data.cover;
  return topicOf(post) === topics[0]
    ? "/images/journal/window-cat.webp"
    : topicOf(post) === topics[1]
      ? "/images/journal/quiet-cat-moments.webp"
      : "/images/journal/home-with-cats.webp";
}
export function readingTime(body: string) {
  const plain = body.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#*`]/g, '');
  return Math.max(1, Math.ceil((plain.match(/\b[\w'-]+\b/g) || []).length / 200));
}
export function dateLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
