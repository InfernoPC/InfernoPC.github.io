import { prepare, localDate } from "./data.js";
import { attachSearch } from "./search.js";
import { attachKeys } from "./keys.js";
import { attachTheme } from "./theme.js";

const FALLBACK_TEMPLATE = "sticker";

async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
}

function loadStyle(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = resolve;
    link.onerror = () => reject(new Error(`${href} 載入失敗`));
    document.head.append(link);
  });
}

async function loadTemplate(name) {
  const base = new URL(`../templates/${name}/`, import.meta.url);
  const [mod] = await Promise.all([import(new URL("render.js", base)), loadStyle(new URL("style.css", base))]);
  return mod;
}

async function main() {
  const root = document.getElementById("app");
  let site, links;
  try {
    [site, links] = await Promise.all([loadJSON("site.json"), loadJSON("links.json")]);
  } catch (err) {
    console.error(err);
    root.querySelector("[data-status]").textContent = "連結清單讀取失敗，請重新整理。";
    return;
  }

  const name = /^[a-z0-9-]+$/.test(site.template || "") ? site.template : FALLBACK_TEMPLATE;
  let template;
  try {
    template = await loadTemplate(name);
  } catch (err) {
    console.warn(`模版「${name}」載入失敗，改用 ${FALLBACK_TEMPLATE}`, err);
    template = await loadTemplate(FALLBACK_TEMPLATE);
  }

  const data = prepare(site, links, { today: localDate(), origin: location.origin });
  template.render(root, data);
  attachSearch(root, data.groups);
  attachKeys(root, data.groups);
  attachTheme(root);
  root.removeAttribute("aria-busy");
}

main();
