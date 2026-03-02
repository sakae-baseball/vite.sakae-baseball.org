---
layout: home
title: 栄区野球協会
hero:
  name: 栄区野球協会
  text: 栄区民野球大会を開催中
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

## お問い合わせ

栄区野球協会に関するお問い合わせは、[問い合わせフォーム](https://docs.google.com/forms/d/e/1FAIpQLScTGB5kxiIcle_gSjp9jTVGVUhWsiErTJTWfPeVnKtBt83n3A/viewform) までご連絡ください。
