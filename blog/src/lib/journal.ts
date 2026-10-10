import type { CollectionEntry } from "astro:content";

export const topics = ["温馨家居", "相处日常", "用品选择"];
export function topicOf(post: CollectionEntry<"posts">) {
  if (post.data.category) return post.data.category;
  const tags = post.data.tags.join(" ");
  if (/家居|空间|布置/.test(tags)) return "温馨家居";
  if (/陪伴|日常|相处/.test(tags)) return "相处日常";
  return "用品选择";
}
export function coverOf(post: CollectionEntry<"posts">) {
  if (post.data.cover) return post.data.cover;
  return topicOf(post) === "温馨家居"
    ? "/images/journal/window-cat.webp"
    : topicOf(post) === "相处日常"
      ? "/images/journal/daily-companion.webp"
      : "/images/journal/home-together.webp";
}
export function readingTime(body: string) {
  return Math.max(1, Math.ceil(body.replace(/[#*\[\]()`]/g, "").length / 400));
}
export function dateLabel(date: Date) {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  });
}
