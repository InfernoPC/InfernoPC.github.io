import { test } from "node:test";
import assert from "node:assert/strict";
import { prepare, normalizeBadge, isExternal } from "../app/data.js";

const site = {
  categories: [
    { id: "tools", label: "工具" },
    { id: "writing", label: "文章" },
    { id: "archive", label: "舊作品", muted: true },
  ],
};
const opts = { today: "2026-10-11", origin: "https://infernopc.github.io" };

test("groups follow category order and keep link order inside", () => {
  const links = [
    { id: "b", title: "B", url: "/b/", category: "writing" },
    { id: "t1", title: "T1", url: "/t1/", category: "tools" },
    { id: "t2", title: "T2", url: "/t2/", category: "tools" },
  ];
  const { groups } = prepare(site, links, opts);
  assert.deepEqual(groups.map((g) => g.category.id), ["tools", "writing"]);
  assert.deepEqual(groups[0].items.map((i) => i.id), ["t1", "t2"]);
});

test("empty categories are skipped", () => {
  const { groups } = prepare(site, [{ id: "a", title: "A", url: "/a/", category: "tools" }], opts);
  assert.equal(groups.length, 1);
});

test("links with unknown category are dropped", () => {
  const { groups } = prepare(site, [{ id: "x", title: "X", url: "/x/", category: "nope" }], opts);
  assert.equal(groups.length, 0);
});

test("colors rotate when not given, explicit color wins", () => {
  const links = [
    { id: "a", title: "A", url: "/a/", category: "tools" },
    { id: "b", title: "B", url: "/b/", category: "tools", color: "lilac" },
    { id: "c", title: "C", url: "/c/", category: "tools" },
  ];
  const items = prepare(site, links, opts).groups[0].items;
  assert.deepEqual(items.map((i) => i.color), ["yellow", "lilac", "pink"]);
});

test("muted flag comes from category", () => {
  const { groups } = prepare(site, [{ id: "a", title: "A", url: "/a/", category: "archive" }], opts);
  assert.equal(groups[0].items[0].muted, true);
});

test("pinned badge", () => {
  assert.deepEqual(normalizeBadge({ url: "/a/", badge: "pinned" }, "2026-10-11"), { type: "pinned", text: "常用" });
});

test("new badge shows until its date inclusive, then disappears", () => {
  const link = { url: "/a/", badge: { type: "new", until: "2026-10-11" } };
  assert.deepEqual(normalizeBadge(link, "2026-10-11"), { type: "new", text: "新家" });
  assert.equal(normalizeBadge(link, "2026-10-12"), null);
});

test("new badge accepts custom text", () => {
  const link = { url: "/a/", badge: { type: "new", text: "NEW", until: "2099-01-01" } };
  assert.deepEqual(normalizeBadge(link, "2026-10-11"), { type: "new", text: "NEW" });
});

test("year badge", () => {
  assert.deepEqual(normalizeBadge({ url: "/a/", badge: { type: "year", text: "2018" } }, "2026-10-11"), {
    type: "year",
    text: "2018",
  });
});

test("github urls get a repo badge automatically", () => {
  assert.deepEqual(normalizeBadge({ url: "https://github.com/InfernoPC/Miaozhu" }, "2026-10-11"), {
    type: "repo",
    text: "GitHub",
  });
});

test("manual badge beats automatic repo badge", () => {
  const link = { url: "https://github.com/InfernoPC/x", badge: "pinned" };
  assert.equal(normalizeBadge(link, "2026-10-11").type, "pinned");
});

test("no badge for plain links", () => {
  assert.equal(normalizeBadge({ url: "/a/" }, "2026-10-11"), null);
});

test("isExternal", () => {
  assert.equal(isExternal("/toolkit/", opts.origin), false);
  assert.equal(isExternal("https://infernopc.github.io/toolkit/", opts.origin), false);
  assert.equal(isExternal("https://github.com/InfernoPC", opts.origin), true);
  assert.equal(isExternal("mailto:a@b.c", opts.origin), true);
});

test("prepared items carry external and badge", () => {
  const links = [{ id: "g", title: "G", url: "https://github.com/x/y", category: "tools" }];
  const item = prepare(site, links, opts).groups[0].items[0];
  assert.equal(item.external, true);
  assert.equal(item.badge.type, "repo");
});
