# infernopc.github.io

Tim 的入口網站，以及所有子站共用的樣式 `shared/v1/`。純靜態，不用建置。

## 新增連結

在 `links.json` 加一筆，順序就是顯示順序：

```json
{
  "id": "my-tool",
  "title": "My Tool",
  "desc": "一句話說明",
  "url": "/my-tool/",
  "category": "tools",
  "icon": "✦",
  "color": "mint",
  "key": "m",
  "tags": ["關鍵字"]
}
```

| 欄位 | 說明 |
|---|---|
| `url` | 站內子站用 `/repo-name/`；外部服務用完整 `https://…`（會開新分頁） |
| `category` | `site.json` 裡 `categories` 的 `id` |
| `color` | `yellow` `mint` `pink` `sky` `lilac`；省略時自動輪替 |
| `badge` | `"pinned"`（常用）、`{ "type": "new", "until": "2026-12-31" }`（新家，過期自動消失）、`{ "type": "year", "text": "2018" }` |
| `key` | 單鍵快捷鍵，一個小寫英數字 |

GitHub repo 網址會自動加上「GitHub」徽章。改完執行 `npm run validate` 檢查格式。

## 換模版

`site.json` 的 `"template"` 改成 `templates/` 底下的資料夾名稱。

新增模版：建立 `templates/<name>/render.js` 與 `style.css`。`render.js` 匯出：

```js
export function render(root, { site, groups }) { /* 畫出 HTML */ }
```

並遵守這些約定，搜尋、快捷鍵與主題切換才會自動生效：

- 卡片 `<a data-link-id="…">`
- 搜尋框 `<input data-search>`
- 分類 `<section data-category="…">`
- 無結果提示 `[data-empty]`
- 主題按鈕 `[data-theme-toggle]`

## 子站使用共用樣式

```html
<script src="/shared/v1/theme-init.js"></script>          <!-- 放 <head>，避免閃白 -->
<link rel="stylesheet" href="/shared/v1/tokens.css">       <!-- 顏色、字型、深淺色變數 -->
<link rel="stylesheet" href="/shared/v1/base.css">         <!-- 底色、字型、焦點框 -->
<link rel="stylesheet" href="/shared/v1/components.css">   <!-- .ui-card .ui-chip .ui-badge .ui-button .ui-input .ui-kbd -->
<script type="module" src="/shared/v1/site-nav.js"></script>
<site-nav></site-nav>                                       <!-- 回入口 + 深淺色切換 -->
```

不同網域的服務改用完整網址 `https://infernopc.github.io/shared/v1/…`，`<site-nav home="https://infernopc.github.io/">`。

深淺色偏好存在 `localStorage["ui-theme"]`，同網域的子站共用。
`v1` 只做不破壞的改動；破壞性改動請開 `v2/`。

## 開發

```sh
npm run serve      # http://localhost:8000
npm test           # 單元測試（node --test）
npm run validate   # 檢查 links.json
```

設計文件：`docs/superpowers/specs/2026-10-11-portal-design.md`
