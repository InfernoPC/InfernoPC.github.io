import { test } from "node:test";
import assert from "node:assert/strict";
import { matches } from "../app/search.js";

const item = { title: "Toolkit", desc: "貼上文字，自動判斷格式並解析", tags: ["base64", "URL"], categoryLabel: "工具" };

test("empty query matches everything", () => {
  assert.equal(matches(item, ""), true);
  assert.equal(matches(item, "   "), true);
});

test("matches title case-insensitively", () => {
  assert.equal(matches(item, "TOOL"), true);
});

test("matches desc, tags and category label", () => {
  assert.equal(matches(item, "格式"), true);
  assert.equal(matches(item, "url"), true);
  assert.equal(matches(item, "工具"), true);
});

test("all words must match", () => {
  assert.equal(matches(item, "tool base64"), true);
  assert.equal(matches(item, "tool qr"), false);
});

test("non-matching query", () => {
  assert.equal(matches(item, "qrcode"), false);
});

test("missing optional fields are fine", () => {
  assert.equal(matches({ title: "Blog" }, "blog"), true);
});
