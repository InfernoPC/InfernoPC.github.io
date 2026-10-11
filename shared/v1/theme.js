// 深淺色切換。搭配 theme-init.js（負責第一次套用）使用。
const KEY = "ui-theme";
const media = window.matchMedia("(prefers-color-scheme: dark)");
const listeners = new Set();

function read() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function apply(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  listeners.forEach((fn) => fn(theme));
}

export function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function setTheme(theme) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
  apply(theme);
}

export function toggleTheme() {
  setTheme(currentTheme() === "dark" ? "light" : "dark");
}

export function onThemeChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// 沒有手動選過時，跟著系統設定變
media.addEventListener("change", (e) => {
  if (!read()) apply(e.matches ? "dark" : "light");
});

// 其他分頁或子站切換時同步
window.addEventListener("storage", (e) => {
  if (e.key === KEY && e.newValue) apply(e.newValue);
});
