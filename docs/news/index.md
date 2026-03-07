---
title: お知らせ
---

<script setup>
const newsModules = import.meta.glob('./*.md', {
	eager: true,
	import: '__pageData'
})

const allNews = Object.entries(newsModules)
	.filter(([path]) => /\.\/\d{4}-\d{2}-\d{2}-.+\.md$/.test(path))
	.sort(([pathA], [pathB]) => pathB.localeCompare(pathA))
	.map(([path, pageData]) => {
		const slug = path.match(/\.\/(.+)\.md$/)?.[1] ?? ''
		const parsedPageData = typeof pageData === 'string' ? JSON.parse(pageData) : pageData

		return {
			title: parsedPageData?.frontmatter?.title ?? slug,
			link: `./${slug}`
		}
	})
</script>

# お知らせ

::: warning お知らせ
[以前のお知らせはこちら](https://sakae-baseball.hatenablog.com)
:::

## 記事一覧

<ul>
	<li v-for="news in allNews" :key="news.link">
		<a :href="news.link">{{ news.title }}</a>
	</li>
</ul>

