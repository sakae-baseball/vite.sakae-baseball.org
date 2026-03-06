<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

type PageDataModule = {
	frontmatter?: {
		title?: string
	}
}

const { page } = useData()

const newsModules = import.meta.glob('../../../news/*.md', {
	eager: true,
	import: '__pageData'
}) as Record<string, PageDataModule | string>

const allNews = Object.entries(newsModules)
	.filter(([path]) => /news\/\d{4}-\d{2}-\d{2}-.+\.md$/.test(path))
	.sort(([pathA], [pathB]) => pathB.localeCompare(pathA))
	.map(([path, pageData]) => {
		const slug = path.match(/news\/(.+)\.md$/)?.[1] ?? ''
		const parsedPageData = typeof pageData === 'string' ? JSON.parse(pageData) : pageData

		return {
			slug,
			title: parsedPageData?.frontmatter?.title ?? slug,
			link: `/news/${slug}`
		}
	})

const currentSlug = computed(() => {
	const relativePath = page.value.relativePath ?? ''
	return relativePath.match(/^news\/(.+)\.md$/)?.[1] ?? null
})

const currentIndex = computed(() => {
	if (!currentSlug.value) {
		return -1
	}

	return allNews.findIndex((item) => item.slug === currentSlug.value)
})

const previousArticle = computed(() => {
	if (currentIndex.value < 0 || currentIndex.value >= allNews.length - 1) {
		return null
	}

	return allNews[currentIndex.value + 1]
})

const nextArticle = computed(() => {
	if (currentIndex.value <= 0) {
		return null
	}

	return allNews[currentIndex.value - 1]
})

const shouldShow = computed(() => {
	return currentIndex.value >= 0 && (previousArticle.value || nextArticle.value)
})
</script>

<template>
	<nav v-if="shouldShow" class="news-article-nav" aria-label="前後の記事">
		<a v-if="previousArticle" :href="previousArticle.link" class="news-article-nav__link">
			<span class="news-article-nav__label">前の記事</span>
			<span class="news-article-nav__title">{{ previousArticle.title }}</span>
		</a>
		<a v-if="nextArticle" :href="nextArticle.link" class="news-article-nav__link news-article-nav__link--next">
			<span class="news-article-nav__label">次の記事</span>
			<span class="news-article-nav__title">{{ nextArticle.title }}</span>
		</a>
	</nav>
</template>
