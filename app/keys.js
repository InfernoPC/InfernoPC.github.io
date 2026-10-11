// 單鍵快捷鍵：焦點不在輸入框、沒按修飾鍵時，按下 link.key 打開該連結。
import { isTyping } from "./search.js";

export function attachKeys(root, groups) {
  const byKey = new Map();
  for (const item of groups.flatMap((g) => g.items)) {
    if (item.key) byKey.set(item.key.toLowerCase(), item.id);
  }
  if (byKey.size === 0) return;

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || isTyping(document.activeElement)) return;
    const id = byKey.get(e.key.toLowerCase());
    if (!id) return;
    const card = root.querySelector(`[data-link-id="${CSS.escape(id)}"]`);
    if (card && !card.hidden) {
      e.preventDefault();
      card.click();
    }
  });
}
