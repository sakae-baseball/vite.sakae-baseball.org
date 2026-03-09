import { defineConfig } from 'vitepress'

export default defineConfig({
	lang: 'ja-JP',
	title: '栄区野球協会 栄区民野球大会を開催中',
	description: '栄区民野球大会の最新情報、日程、試合結果、協会概要を掲載しています。',
	head: [
		['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
		['meta', { name: 'keywords', content: '栄区民野球大会, 軟式野球, 横浜市栄区' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:title', content: '栄区野球協会' }],
		['meta', { property: 'og:description', content: '栄区野球協会の公式サイトです。日程・結果や協会情報を掲載しています。' }],
		['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-W7E5WF4QNH' }],
		[
			'script',
			{},
			"window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-W7E5WF4QNH');"
		]
	],
	transformHead: ({ pageData }) => {
		const frontmatter = pageData.frontmatter ?? {}
		const frontmatterOgp = typeof frontmatter.ogp === 'string' ? frontmatter.ogp : null
		const frontmatterImage = typeof frontmatter.image === 'string' ? frontmatter.image : null
		const imagePath = frontmatterOgp ?? frontmatterImage
		const resolvedImage =
			typeof imagePath === 'string' && imagePath.length > 0
				? imagePath.startsWith('http')
					? imagePath
					: `https://sakae-baseball.org${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
				: null
		const frontmatterHead = Array.isArray(frontmatter.head) ? frontmatter.head : []

		const hasOgImageInHead = frontmatterHead.some((entry) => {
			if (!Array.isArray(entry) || entry.length < 2) {
				return false
			}

			const [tag, attrs] = entry
			if (tag !== 'meta' || !attrs || typeof attrs !== 'object') {
				return false
			}

			const metaProperty = (attrs as Record<string, unknown>).property
			const metaName = (attrs as Record<string, unknown>).name

			return metaProperty === 'og:image' || metaName === 'twitter:image'
		})

		if (hasOgImageInHead) {
			return []
		}

		if (resolvedImage) {
			return [
				['meta', { property: 'og:image', content: resolvedImage }],
				['meta', { name: 'twitter:image', content: resolvedImage }]
			]
		}

		return [
			['meta', { property: 'og:image', content: 'https://sakae-baseball.org/sakaejsbb.png' }],
			['meta', { name: 'twitter:image', content: 'https://sakae-baseball.org/sakaejsbb.png' }]
		]
	},
	themeConfig: {
		nav: [
				{ text: 'トップ', link: '/' },
				{ text: 'お知らせ', link: '/news/' },
				{ text: '成績', link: '/winner' },
				{ text: '協会概要', link: '/association' }
		],
		socialLinks: [
			{ icon: 'twitter', link: 'https://x.com/SakaeBaseball' },
            { icon: 'facebook', link: 'https://www.facebook.com/sakae.baseball' },
			{ icon: 'instagram', link: 'https://www.instagram.com/sakaejsbb/' }
		],
		footer: {
			message: '栄区野球協会',
			copyright: '© 2000,Sakae Baseball Association.'
		}
	}
})
