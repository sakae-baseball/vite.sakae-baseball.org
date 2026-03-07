---
layout: home
title: 栄区野球協会
hero:
  name: 栄区野球協会
  text: 
  actions:
    - theme: brand
      text: 組合せ・日程を見る
      link: /news/
---



<script setup>
const newsModules = import.meta.glob('./news/*.md', {
  eager: true,
  import: '__pageData'
})

const latestNews = Object.entries(newsModules)
  .filter(([path]) => /\.\/news\/\d{4}-\d{2}-\d{2}-.+\.md$/.test(path))
  .sort(([pathA], [pathB]) => pathB.localeCompare(pathA))
  .slice(0, 3)
  .map(([path, pageData]) => {
    const slug = path.match(/\.\/news\/(.+)\.md$/)?.[1] ?? ''
    const parsedPageData = typeof pageData === 'string' ? JSON.parse(pageData) : pageData

    return {
      title: parsedPageData?.frontmatter?.title ?? slug,
      link: `/news/${slug}`
    }
  })
</script>

## 最新ニュース

<ul>
  <li v-for="news in latestNews" :key="news.link">
    <a :href="news.link">{{ news.title }}</a>
  </li>
</ul>

<div class="fixed-notice-banner" role="note" aria-label="固定お知らせ">
  <a href="news/2026-02-28-tournament.html">72回大会組合せ</a>
  <a href="winner">過去の成績</a>
  <a href="news/2026-03-07-umpire.html">審判員募集中</a>
</div>

<img src="/sakae40th.png" alt="栄区野球協会40周年記念" style="display: block; width: clamp(140px, 25vw, 320px); max-width: 100%; height: auto; margin: 0 auto;" />


## お問い合わせ

栄区野球協会に関するお問い合わせは、[問い合わせフォーム](https://docs.google.com/forms/d/e/1FAIpQLScTGB5kxiIcle_gSjp9jTVGVUhWsiErTJTWfPeVnKtBt83n3A/viewform) までご連絡ください。
