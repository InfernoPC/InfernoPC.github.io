# infernopc.github.io 入口網站設計

日期：2026-10-11　狀態：已核准（brainstorming 逐段確認）

## 目標

把 `infernopc.github.io` 從 2018 年的 Jekyll 部落格改成一個簡潔、有設計感的入口頁：
集中連到各個 GitHub Pages 子站（toolkit、qrcode-generator、about-me、blog…）、GitHub 專案，
以及將來自架伺服器上的服務。同時提供子站共用的樣式 `/shared/v1/`。

成功標準：

- 新增一個連結只需要改 `links.json` 一筆資料。
- 換模版只需要改 `site.json` 的 `template` 一個字。
- 桌面、手機、淺色、深色都可用；鍵盤可以完成搜尋與開啟。
- 舊部落格網址（`/blog/YYYY/MM/DD/slug/`）在切換後全部仍可打開（由子專案 ② 負責）。

## 範圍

子專案 ①（本文件）：入口頁、模版機制、搜尋與快捷鍵、深色模式、`shared/v1`。
子專案 ②（另見 blog repo 的 spec）：新的 `blog` repo。①、② 完成後一起切換上線。

不做：toolkit 等子站換樣式、`sticker` 以外的模版。

## 檔案結構

```
InfernoPC.github.io/
├── index.html              殼：meta、主題初始化、<noscript> 連結、載入 app
├── site.json               站台設定與模版名稱
├── links.json              所有連結
├── app/
│   ├── main.js             入口：fetch → 整理 → 載入模版 → render → 掛互動
│   ├── data.js             純函式：整理資料（可在 Node 測試）
│   ├── search.js           純函式：比對；以及 DOM 互動
│   ├── keys.js             單鍵快捷鍵
│   └── theme.js            深淺色切換
├── templates/
│   └── sticker/
│       ├── render.js
│       └── style.css
├── shared/v1/
│   ├── tokens.css
│   ├── base.css
│   ├── components.css
│   ├── theme-init.js       放 <head> 的同步小腳本，避免閃白
│   └── site-nav.js         <site-nav> Web Component
├── scripts/validate-links.mjs
├── tests/*.test.mjs        node --test
└── .nojekyll
```

## 資料格式

### site.json

```json
{
  "template": "sticker",
  "greeting": "Hi, I'm Tim!",
  "bio": "PM，下班喜歡做小工具。這裡是我所有東西的入口。",
  "social": [{ "label": "GitHub", "url": "https://github.com/InfernoPC", "color": "yellow" }],
  "categories": [
    { "id": "tools", "label": "工具" },
    { "id": "writing", "label": "文章" },
    { "id": "projects", "label": "專案" },
    { "id": "archive", "label": "舊作品", "muted": true }
  ]
}
```

### links.json

陣列，順序即顯示順序。欄位：

| 欄位 | 必填 | 說明 |
|---|---|---|
| id | ✓ | 唯一，小寫英數與 `-` |
| title | ✓ | 顯示名稱 |
| url | ✓ | 站內用 `/path/`，外部用完整 `https://` |
| category | ✓ | 必須存在於 `site.categories` |
| desc | | 一句話說明 |
| icon | | 一個字元或 emoji |
| color | | `yellow` `mint` `pink` `sky` `lilac`，預設依序輪替 |
| badge | | `"pinned"`、`{ "type": "new", "until": "YYYY-MM-DD" }`、`{ "type": "year", "text": "2018" }` |
| key | | 單一小寫字母或數字，唯一 |
| tags | | 額外搜尋關鍵字 |

規則：

- 網址是 `https://github.com/` 開頭且沒有手動指定 badge 時，自動加上 `repo` 徽章。
- `new` 徽章過了 `until` 當天就不顯示。
- `muted` 分類內的卡片用淡色陰影。
- 外部網址（不同 origin）開新分頁並加 `rel="noopener"`；站內同分頁。

## 執行流程（app/main.js）

1. 同時 fetch `site.json`、`links.json`（相對路徑，`cache: "no-cache"`）。
2. `data.js` 的 `prepare(site, links, today)` 回傳 `{ site, groups }`；
   `groups = [{ category, items }]`，空分類略過，每個 item 補上 `badge`（正規化後）、`color`、`external`。
3. 動態 `import(`../templates/${name}/render.js`)` 並插入對應 `style.css`；失敗退回 `sticker`，console.warn。
4. `render(root, data)`。
5. 掛上搜尋、快捷鍵、主題切換。

讀取失敗：顯示「連結清單讀取失敗，請重新整理」，`index.html` 內寫死的 GitHub 連結保留。

## 模版介面

```js
export function render(root, { site, groups }) { … }
```

模版必須輸出的約定：

- 每張卡片 `<a data-link-id="…" href="…">`，內含標題文字。
- 搜尋框 `<input data-search>`。
- 分類區塊 `<section data-category="…">`。
- 沒有結果時的提示元素 `[data-empty]`（預設 hidden）。
- 主題切換按鈕 `[data-theme-toggle]`。

搜尋、快捷鍵、主題只依賴這些屬性。

## 搜尋與快捷鍵

- `/` 聚焦搜尋框；`Esc` 清空並離開。
- 比對 `title`、`desc`、`tags`、`category label`，不分大小寫，多個空白分隔的詞須全部命中。
- 不符合的卡片 `hidden`；整個分類無結果時隱藏該 section；全部無結果顯示 `找不到「xxx」，試試其他關鍵字`。
- 搜尋框內 `Enter` 開啟目前選取（預設第一個）結果；`↑` `↓` 移動選取。
- 單鍵：焦點不在輸入元素、沒有按 Ctrl/Meta/Alt 時，按下 `key` 開啟對應連結。桌面版卡片角落顯示字母，手機版隱藏。

## 視覺：sticker 模版（B2 + 徽章）

- 底色 `#fdf6e3` 加 14px 圓點；2px 黑框 `#1d1b22`；圓角 14px。
- 卡片陰影：`5px 5px 0 <彩色>, 5px 5px 0 2px <框線色>`（彩色塊外包黑框）。
- 色名：yellow `#ffd23f`、mint `#7ee0c3`、pink `#ff8fab`、sky `#9ad1ff`、lilac `#c6b6ff`。
- 字型：Space Grotesk + Noto Sans TC（Google Fonts）。
- 每三張卡片中第二張微傾 -1.2deg（減少動態效果時不傾斜）。
- 徽章：實色、z-index 在卡片之上、外圈 3px 底色描邊切開框線；位置右上 `top:-13px; right:12px`，旋轉 6deg。
  `pinned`=常用（pink）、`new`=新家（mint）、`repo`=GitHub（lilac）、`year`=年份（白/奶油）。
- 搜尋條：白底，sky 色錯位陰影。
- 手機（< 640px）：卡片單欄橫條（圖示在左），不傾斜，隱藏快捷鍵字母與 `/` 提示，搜尋框 sticky，社群 chips 可橫向捲動。

### 深色（D2 + S1）

- 框線維持黑 `#0c0b10`；文字 `#f4eee2`；背景 `#211f2c`、圓點 `#2e2b3b`。
- 卡片填自己顏色的深色版：yellow `#4a3f1f`、mint `#1f4a3f`、pink `#4d2a36`、sky `#1e3a52`、lilac `#36305a`；muted 卡片 `#34304a`。
- 陰影維持亮糖果色；徽章與彩色按鈕上的文字維持深色。
- 搜尋條：sky 深色底 `#1e3a52` + 亮藍陰影，`/` 鍵帽亮藍底。

### 深淺色切換

- 預設跟隨 `prefers-color-scheme`；手動切換存 `localStorage["ui-theme"]`（`light`/`dark`），同 origin 的子站共用。
- `<html data-theme="light|dark">`；`theme-init.js` 同步執行於 `<head>`。

## shared/v1

- `tokens.css`：所有 `--ui-*` 變數，含 `[data-theme="dark"]` 覆寫；色名提供 `--ui-<色>` 與 `--ui-<色>-deep`。
- `base.css`：body 底色與圓點、字型、連結、`:focus-visible` 外框、減少動態。
- `components.css`：`.ui-card`、`.ui-chip`、`.ui-badge`、`.ui-button`、`.ui-input`。
- `site-nav.js`：`<site-nav>`，Shadow DOM，左側「← InfernoPC」回 `/`，右側主題切換鈕。
- 版本規則：`v1` 內只做不破壞的改動；破壞性改動開 `v2`。

## 無障礙

卡片為 `<a>`、可 Tab；`:focus-visible` 3px 外框；`prefers-reduced-motion` 時移除傾斜與過場；
色彩對比：卡片文字對卡片底 ≥ 4.5:1（淺、深兩版）。

## 測試

- `node --test`：`data.js`（排序、分組、徽章正規化與過期、repo 自動徽章、external 判斷）、`search.js` 比對函式。
- `node scripts/validate-links.mjs`：必填欄位、category 存在、id/key 唯一、color 合法。
- Playwright：桌面/手機 × 淺/深 四張截圖檢查；`/`、輸入、`↑↓`、`Enter`、`Esc`、單鍵快捷鍵。

## 上線（①、② 完成後）

1. 建立並發佈 `blog` repo（Pages，GitHub Actions 建置）。
2. `portal` 合併回 `master`：刪除 Jekyll 檔案，加 `.nojekyll`。
3. 驗證入口、全部舊文章網址、`/toolkit/`、`/qrcode-generator/`、`/about-me/`。
4. 回退：revert 合併 commit。
