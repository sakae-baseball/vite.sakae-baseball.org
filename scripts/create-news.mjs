import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const NEWS_DIR = path.resolve("docs/news");

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      args[key] = next;
      i += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

function toDateParts(dateText) {
  if (!dateText) {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate()
    };
  }

  const match = dateText.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    throw new Error("--date は YYYY-MM-DD 形式で指定してください");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error("--date に存在しない日付が指定されています");
  }

  return { year, month, day };
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function makeSlug(title) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const title = (args.title ?? "").trim();
  const manualSlug = typeof args.slug === "string" ? args.slug.trim() : "";

  if (!title) {
    console.error("使い方: node scripts/create-news.mjs --title <記事タイトル> [--date YYYY-MM-DD] [--slug slug]");
    process.exit(1);
  }

  const { year, month, day } = toDateParts(args.date);
  const datePart = `${year}-${pad2(month)}-${pad2(day)}`;
  const slugCandidate = (manualSlug || makeSlug(title) || "news").replace(/[^a-z0-9-]/g, "");
  const slugPart = slugCandidate || "news";
  const fileName = `${datePart}-${slugPart}.md`;
  const filePath = path.join(NEWS_DIR, fileName);

  if (await exists(filePath)) {
    throw new Error(`ファイルが既に存在します: ${filePath}`);
  }

  const isoDate = new Date(Date.UTC(year, month - 1, day)).toISOString();
  const ogp = `/ogp/${datePart}-${slugPart}.png`;

  const content = `---
title: ${title}
firstPublished: ${isoDate}
updated: ${isoDate}
ogp: ${ogp}
og:title: ${title}
---

# ${title}

`;

  await mkdir(NEWS_DIR, { recursive: true });
  await writeFile(filePath, content, "utf8");

  console.log(`作成: ${filePath}`);
  console.log(`次の手順: node scripts/generate-ogp.mjs --md docs/news/${fileName}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
