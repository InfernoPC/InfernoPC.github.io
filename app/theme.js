// 把頁面上的 [data-theme-toggle] 接到共用的主題切換。
import { currentTheme, toggleTheme, onThemeChange } from "../shared/v1/theme.js";

export function attachTheme(root) {
  const buttons = [...root.querySelectorAll("[data-theme-toggle]")];
  const sync = (theme) => {
    for (const b of buttons) {
      b.textContent = theme === "dark" ? "☀" : "☾";
      b.setAttribute("aria-label", theme === "dark" ? "切換成淺色" : "切換成深色");
    }
  };
  sync(currentTheme());
  buttons.forEach((b) => b.addEventListener("click", toggleTheme));
  onThemeChange(sync);
}
