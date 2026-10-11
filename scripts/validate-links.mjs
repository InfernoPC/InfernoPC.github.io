// 檢查 site.json / links.json 格式。用法：node scripts/validate-links.mjs
import { readFile } from "node:fs/promises";
import { COLORS } from "../app/data.js";

const root = new URL("../", import.meta.url);
const site = JSON.parse(await readFile(new URL("site.json", root), "utf8"));
const links = JSON.parse(await readFile(new URL("links.json", root), "utf8"));

const errors = [];
const categories = new Set((site.categories || []).map((c) => c.id));
const ids = new Set();
const keys = new Set();
const BADGES = new Set(["pinned", "new", "year", "repo"]);

if (!/^[a-z0-9-]+$/.test(site.template || "")) errors.push(`site.template 格式不對：${site.template}`);
if (!categories.size) errors.push("site.categories 是空的");

links.forEach((link, i) => {
  const where = `links[${i}]${link.id ? ` (${link.id})` : ""}`;
  for (const field of ["id", "title", "url", "category"]) {
    if (!link[field]) errors.push(`${where} 缺少 ${field}`);
  }
  if (link.id && !/^[a-z0-9-]+$/.test(link.id)) errors.push(`${where} id 只能用小寫英數和 -`);
  if (link.id && ids.has(link.id)) errors.push(`${where} id 重複`);
  ids.add(link.id);
  if (link.category && !categories.has(link.category)) errors.push(`${where} 分類 ${link.category} 不存在`);
  if (link.color && !COLORS.includes(link.color)) errors.push(`${where} color 只能是 ${COLORS.join("/")}`);
  if (link.key) {
    if (!/^[a-z0-9]$/.test(link.key)) errors.push(`${where} key 必須是單一小寫英數字`);
    if (keys.has(link.key)) errors.push(`${where} key「${link.key}」重複`);
    keys.add(link.key);
  }
  if (link.badge) {
    const type = typeof link.badge === "string" ? link.badge : link.badge.type;
    if (!BADGES.has(type)) errors.push(`${where} badge 類型 ${type} 不存在`);
    if (type === "year" && !link.badge.text) errors.push(`${where} year 徽章需要 text`);
    if (link.badge.until && !/^\d{4}-\d{2}-\d{2}$/.test(link.badge.until)) errors.push(`${where} until 要是 YYYY-MM-DD`);
  }
  if (link.tags && !Array.isArray(link.tags)) errors.push(`${where} tags 要是陣列`);
});

if (errors.length) {
  console.error(errors.map((e) => `✖ ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ ${links.length} 筆連結、${categories.size} 個分類，格式正確`);
