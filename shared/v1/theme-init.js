// 放在 <head> 同步執行，避免頁面先閃一下錯的主題。
// 偏好存在 localStorage["ui-theme"]，同 origin 的子站共用。
(function () {
  var saved = null;
  try {
    saved = localStorage.getItem("ui-theme");
  } catch (e) {}
  var dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
})();
