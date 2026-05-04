#!/usr/bin/env python3
"""
区民大会結果PDFからVitePressニュース記事のMarkdownを生成する

Usage:
  python3 scripts/result-from-pdf.py <pdf-path> [--publish-date YYYY-MM-DD]

出力はstdoutに書き出す。docs/news/ へのリダイレクトはシェル側で行う。
"""

import sys
import re
import unicodedata
import argparse
from datetime import date, datetime, timezone


def nfkc(text):
    if text is None:
        return ""
    return unicodedata.normalize("NFKC", text).strip()


def parse_game_date(text):
    m = re.search(r"(\d{4})年(\d{1,2})月(\d{1,2})日", text)
    if not m:
        return None
    return date(int(m.group(1)), int(m.group(2)), int(m.group(3)))


def parse_blocks_and_games(text):
    """テキストから (試合番号, ブロック名) のリストを順番に抽出する"""
    results = []
    current_block = None
    for raw in text.splitlines():
        line = nfkc(raw)
        bm = re.match(r"^([A-Z]+ブロック(?:予選|決勝)?)\s*$", line)
        if bm:
            current_block = bm.group(1)
            continue
        gm = re.match(r"^第(\d+)試合", line)
        if gm and current_block:
            results.append((gm.group(1), current_block))
    return results


def format_score_line(row):
    """[name, inn1..inn9, total, lottery] から 'ABC DEF|total' 形式に変換する"""
    innings = [row[i] for i in range(1, 10) if row[i] != ""]
    total = row[10]
    first3 = "".join(innings[:3])
    rest = "".join(innings[3:])
    return f"{first3} {rest}|{total}" if rest else f"{first3}|{total}"


def find_forfeit_note(rows):
    for row in rows:
        for cell in row[1:10]:
            if "棄権" in cell:
                m = re.search(r"棄権[（(]([^）)]+)[）)]", cell)
                return f"（棄権・{m.group(1)}）" if m else "（棄権）"
    return ""


def build_article(pdf_path, publish_date):
    import pdfplumber

    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[0]
        raw_text = page.extract_text() or ""
        tables = page.extract_tables()

    game_date = parse_game_date(raw_text)
    if not game_date:
        print("ERROR: PDFから大会日付を取得できませんでした", file=sys.stderr)
        sys.exit(1)

    game_tables = [t for t in tables if nfkc((t[0] or [""])[0]) == "チーム名"]
    blocks_games = parse_blocks_and_games(raw_text)

    gd = game_date.strftime("%Y-%m-%d")
    pd = publish_date.strftime("%Y-%m-%d")
    slug = f"{gd.replace('-', '')}result"
    iso_date = (
        datetime(publish_date.year, publish_date.month, publish_date.day, tzinfo=timezone.utc)
        .isoformat()
        .replace("+00:00", ".000Z")
    )
    title = f"{gd}栄区制40周年記念栄区民野球大会結果"

    out = []
    out += [
        "---",
        f"title: {title}",
        f"firstPublished: {iso_date}",
        f"updated: {iso_date}",
        f"ogp: /ogp/{pd}-{slug}.png",
        f"'og:title': {title}",
        f"'og:type': article",
        "---",
        "",
        f"# {gd} 栄区制40周年記念栄区民野球大会 結果",
        "",
    ]

    for i, table in enumerate(game_tables):
        if i >= len(blocks_games):
            break
        game_num, block = blocks_games[i]
        team_rows = [
            [nfkc(c) for c in row]
            for row in table[1:]
            if nfkc((row or [""])[0])
        ]
        if len(team_rows) < 2:
            continue

        row_a, row_b = team_rows[0], team_rows[1]
        name_a, name_b = row_a[0], row_b[0]
        total_a, total_b = row_a[10], row_b[10]
        forfeit = find_forfeit_note([row_a, row_b])

        try:
            if int(total_a) >= int(total_b):
                summary = f"{name_a} {total_a} — {total_b} {name_b}"
            else:
                summary = f"{name_b} {total_b} — {total_a} {name_a}"
        except ValueError:
            summary = f"{name_a} {total_a} — {total_b} {name_b}"

        out += [f"## 第{game_num}試合（{block}）", ""]
        out.append(f"- {summary}{forfeit}")
        out.append("")

        if not forfeit:
            out += [
                "```",
                name_a,
                format_score_line(row_a),
                format_score_line(row_b),
                name_b,
                "```",
                "",
            ]

    return "\n".join(out)


def main():
    parser = argparse.ArgumentParser(
        description="区民大会結果PDFからMarkdownを生成してstdoutに出力する"
    )
    parser.add_argument("pdf", help="PDFファイルパス")
    parser.add_argument("--publish-date", help="公開日 YYYY-MM-DD（省略時は今日）")
    args = parser.parse_args()

    publish_date = (
        date.fromisoformat(args.publish_date) if args.publish_date else date.today()
    )
    print(build_article(args.pdf, publish_date))


if __name__ == "__main__":
    main()
