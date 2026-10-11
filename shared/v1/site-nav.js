// <site-nav>：子站頂部的「回入口」小條，含深淺色切換。
// 用法：<script type="module" src="/shared/v1/site-nav.js"></script> + <site-nav></site-nav>
// 可選屬性：home="https://infernopc.github.io/"（不同網域時使用）、label="InfernoPC"
import { currentTheme, toggleTheme, onThemeChange } from "./theme.js";

const css = `
  :host { display: block; font-family: var(--ui-font, system-ui, sans-serif); }
  nav {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    max-width: var(--site-nav-width, 960px); margin: 0 auto; padding: 14px 16px;
  }
  a, button {
    display: inline-flex; align-items: center; gap: 6px;
    border: var(--ui-border, 2px solid #1d1b22); border-radius: 999px;
    background: var(--ui-surface, #fff); color: var(--ui-text, #1d1b22);
    font: inherit; font-size: 13px; font-weight: 700; text-decoration: none;
    padding: 3px 12px; cursor: pointer; box-shadow: 2px 2px 0 var(--ui-line, #1d1b22);
  }
  button { width: 32px; height: 32px; padding: 0; justify-content: center; background: var(--ui-yellow, #ffd23f); color: var(--ui-on-color, #1d1b22); }
  a:active, button:active { transform: translate(2px, 2px); box-shadow: none; }
  a:focus-visible, button:focus-visible { outline: 3px solid var(--ui-focus, #2f6fe4); outline-offset: 3px; }
`;

class SiteNav extends HTMLElement {
  connectedCallback() {
    const root = this.shadowRoot || this.attachShadow({ mode: "open" });
    const home = this.getAttribute("home") || "/";
    const label = this.getAttribute("label") || "InfernoPC";
    root.innerHTML = `<style>${css}</style>
      <nav aria-label="網站導覽">
        <a href="${home}"><span aria-hidden="true">←</span>${label}</a>
        <button type="button"></button>
      </nav>`;
    const btn = root.querySelector("button");
    const sync = (theme) => {
      btn.textContent = theme === "dark" ? "☀" : "☾";
      btn.setAttribute("aria-label", theme === "dark" ? "切換成淺色" : "切換成深色");
    };
    sync(currentTheme());
    btn.addEventListener("click", toggleTheme);
    this._off = onThemeChange(sync);
  }

  disconnectedCallback() {
    this._off?.();
  }
}

if (!customElements.get("site-nav")) customElements.define("site-nav", SiteNav);
