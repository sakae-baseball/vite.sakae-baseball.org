import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import sharp from "sharp";

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
      args[key] = val;
    }
  }
  return args;
}

function getH1(markdown) {
  const m = markdown.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "";
}

// 日本語ざっくり折り返し（全角=2, 半角=1）
function charWidth(ch) {
  return /[ -~｡-ﾟ]/.test(ch) ? 1 : 2;
}
function wrapText(text, maxWidth = 20, maxLines = 4) {
  const lines = [];
  let line = "";
  let width = 0;

  for (const ch of text) {
    const w = charWidth(ch);
    if (width + w > maxWidth) {
      lines.push(line);
      line = ch;
      width = w;
      if (lines.length >= maxLines - 1) break;
    } else {
      line += ch;
      width += w;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);

  if (lines.length > maxLines) lines.length = maxLines;
  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    lines[maxLines - 1] = last.length > 1 ? `${last.slice(0, -1)}…` : "…";
  }
  return lines;
}

function escapeXml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function main() {
  const args = parseArgs(process.argv);
  const mdPath = args.md;
  const basePath = args.base ?? "docs/public/newstop.png";
  const outDir = args.outDir ?? "docs/public/ogp";
  const field = args.field ?? "ogp";

  if (!mdPath) {
    console.error("使い方: node scripts/generate-ogp.mjs --md <markdown> [--base <png>] [--outDir <dir>] [--field ogp]");
    process.exit(1);
  }

  const raw = await fs.readFile(mdPath, "utf8");
  const fm = matter(raw);

  const h1 = getH1(fm.content);
  const title = h1 || fm.data.title;
  if (!title) {
    throw new Error("タイトルが見つかりません（H1 / frontmatter.title）");
  }

  const meta = await sharp(basePath).metadata();
  const width = meta.width ?? 1200;
  const height = meta.height ?? 630;

  const lines = wrapText(title, 34, 3);
  const fontSize = 120;
  const lineHeight = Math.round(fontSize * 1.2);
  const textBlockHeight = lines.length * lineHeight;
  const startY = Math.floor((height - textBlockHeight) / 2) + 10;
  const bgPadTop = 150;
  const bgPadBottom = 28;

  const tspans = lines
    .map((line, i) => `<tspan x="50%" y="${startY + i * lineHeight}">${escapeXml(line)}</tspan>`)
    .join("");

  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect x="60" y="${startY - bgPadTop}" width="${width - 120}" height="${textBlockHeight + bgPadTop + bgPadBottom}" rx="16" fill="rgba(0,0,0,0.45)"/>
  <text
    text-anchor="middle"
    font-family="'Noto Sans CJK JP','Noto Sans JP','Hiragino Sans','Yu Gothic','sans-serif'"
    font-size="${fontSize}"
    font-weight="700"
    fill="#ffffff"
    letter-spacing="1.2"
  >${tspans}</text>
</svg>`.trim();

  const slug = path.basename(mdPath, path.extname(mdPath));
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, `${slug}.png`);

  await sharp(basePath)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toFile(outPath);

  // frontmatter更新
  const rel = `/ogp/${slug}.png`;
  fm.data[field] = rel;
  const updated = matter.stringify(fm.content, fm.data);
  await fs.writeFile(mdPath, updated, "utf8");

  console.log(`生成: ${outPath}`);
  console.log(`更新: ${mdPath} (${field}: ${rel})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
