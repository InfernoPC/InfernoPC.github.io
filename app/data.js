// 把 site.json + links.json 整理成模版要用的資料。純函式，可在 Node 測試。

export const COLORS = ["yellow", "mint", "pink", "sky", "lilac"];

const BADGE_TEXT = { pinned: "常用", new: "新家", repo: "GitHub" };

export function isExternal(url, origin) {
  try {
    return new URL(url, origin).origin !== origin;
  } catch {
    return false;
  }
}

// today、until 都是 "YYYY-MM-DD"，字串比較即可
export function normalizeBadge(link, today) {
  const raw = typeof link.badge === "string" ? { type: link.badge } : link.badge;

  if (raw) {
    if (raw.type === "new" && raw.until && today > raw.until) return null;
    const text = raw.text || BADGE_TEXT[raw.type];
    if (text) return { type: raw.type, text };
  }

  if (/^https:\/\/github\.com\//.test(link.url)) return { type: "repo", text: BADGE_TEXT.repo };
  return null;
}

export function prepare(site, links, { today, origin }) {
  const groups = site.categories.map((category) => ({ category, items: [] }));
  const byId = new Map(groups.map((g) => [g.category.id, g]));

  for (const link of links) {
    const group = byId.get(link.category);
    if (!group) continue;
    const index = group.items.length;
    group.items.push({
      ...link,
      color: COLORS.includes(link.color) ? link.color : COLORS[index % COLORS.length],
      badge: normalizeBadge(link, today),
      external: isExternal(link.url, origin),
      muted: Boolean(group.category.muted),
      categoryLabel: group.category.label,
    });
  }

  return { site, groups: groups.filter((g) => g.items.length > 0) };
}

export function localDate(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
