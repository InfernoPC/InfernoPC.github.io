// sticker 模版：B2 貼紙普普 + 徽章。只負責畫出 HTML，互動由 app/ 依 data-* 掛上。

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function card(item, index) {
  const classes = ["ui-card", `ui-card-${item.color}`, "st-card"];
  if (item.muted) classes.push("st-muted");
  if (index % 3 === 1) classes.push("st-tilt");
  const attrs = [
    `class="${classes.join(" ")}"`,
    `href="${esc(item.url)}"`,
    `data-link-id="${esc(item.id)}"`,
    item.external ? `target="_blank" rel="noopener"` : "",
    item.key ? `aria-keyshortcuts="${esc(item.key)}"` : "",
  ].join(" ");

  return `<a ${attrs}>
    ${item.badge ? `<span class="ui-badge st-badge st-badge-${esc(item.badge.type)}">${esc(item.badge.text)}</span>` : ""}
    <span class="st-ico" aria-hidden="true">${esc(item.icon || item.title.slice(0, 1))}</span>
    <span class="st-text">
      <span class="st-title">${esc(item.title)}</span>
      ${item.desc ? `<span class="st-desc">${esc(item.desc)}</span>` : ""}
    </span>
    ${item.key ? `<kbd class="st-key" aria-hidden="true">${esc(item.key.toUpperCase())}</kbd>` : ""}
  </a>`;
}

function chip(s) {
  const external = /^https?:\/\//.test(s.url) && !s.url.startsWith(location.origin);
  const color = s.color ? ` style="--ui-accent: var(--ui-${esc(s.color)})"` : " data-plain";
  return `<a class="ui-chip" href="${esc(s.url)}"${color}${external ? ' target="_blank" rel="noopener"' : ""}>${esc(s.label)}</a>`;
}

export function render(root, { site, groups }) {
  root.innerHTML = `
    <div class="st">
      <header class="st-top">
        <div class="st-hello">
          <h1>${esc(site.greeting)}</h1>
          ${site.bio ? `<p>${esc(site.bio)}</p>` : ""}
        </div>
        <div class="st-actions">
          <nav class="st-social" aria-label="個人連結">${(site.social || []).map(chip).join("")}</nav>
          <button type="button" class="st-toggle" data-theme-toggle></button>
        </div>
      </header>

      <div class="st-search" role="search">
        <label class="ui-visually-hidden" for="st-q">搜尋</label>
        <input id="st-q" class="ui-input" type="search" data-search placeholder="搜尋工具、文章、專案…" autocomplete="off" spellcheck="false">
        <kbd class="ui-kbd st-slash" aria-hidden="true">/</kbd>
      </div>
      <p class="st-empty" data-empty hidden role="status"></p>

      ${groups
        .map(
          (g) => `
        <section class="st-group" data-category="${esc(g.category.id)}" aria-labelledby="st-h-${esc(g.category.id)}">
          <h2 id="st-h-${esc(g.category.id)}">${esc(g.category.label)}</h2>
          <div class="st-grid">${g.items.map(card).join("")}</div>
        </section>`,
        )
        .join("")}

      <footer class="st-foot">${site.footer ? site.footer : ""}</footer>
    </div>`;
}
