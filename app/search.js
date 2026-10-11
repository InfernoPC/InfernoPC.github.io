// 搜尋：純比對函式 + 依 data-* 約定掛上 DOM 互動，跟模版長相無關。

export function matches(item, query) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = [item.title, item.desc, item.categoryLabel, ...(item.tags || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return words.every((w) => haystack.includes(w));
}

function isTyping(el) {
  return el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

export function attachSearch(root, groups) {
  const input = root.querySelector("[data-search]");
  if (!input) return;
  const empty = root.querySelector("[data-empty]");
  const items = new Map(groups.flatMap((g) => g.items).map((i) => [i.id, i]));
  const cards = [...root.querySelectorAll("[data-link-id]")];
  const sections = [...root.querySelectorAll("[data-category]")];
  let visible = cards;
  let selected = -1;

  function select(index) {
    cards.forEach((c) => c.removeAttribute("data-selected"));
    selected = visible.length ? Math.max(0, Math.min(index, visible.length - 1)) : -1;
    if (selected >= 0 && input.value.trim()) {
      visible[selected].setAttribute("data-selected", "");
      visible[selected].scrollIntoView({ block: "nearest" });
    }
  }

  function update() {
    const q = input.value;
    visible = cards.filter((card) => {
      const ok = matches(items.get(card.dataset.linkId) || {}, q);
      card.hidden = !ok;
      return ok;
    });
    sections.forEach((s) => {
      s.hidden = !s.querySelector("[data-link-id]:not([hidden])");
    });
    if (empty) {
      empty.hidden = visible.length > 0;
      empty.textContent = visible.length ? "" : `找不到「${q.trim()}」，試試其他關鍵字`;
    }
    select(0);
  }

  input.addEventListener("input", update);
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      select(selected + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      select(selected - 1);
    } else if (e.key === "Enter") {
      if (selected >= 0 && visible[selected]) {
        e.preventDefault();
        visible[selected].click();
      }
    } else if (e.key === "Escape") {
      input.value = "";
      update();
      input.blur();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !isTyping(document.activeElement) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
}

export { isTyping };
