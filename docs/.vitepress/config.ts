import { defineConfig } from 'vitepress'

export default defineConfig({
	lang: 'ja-JP',
	title: '横浜市 栄区野球協会',
	description: '栄区野球大会の最新情報、日程、試合結果、協会概要を掲載しています。',
	head: [
		['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
		['meta', { name: 'keywords', content: '栄区民野球大会, 軟式野球, 横浜市栄区' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:title', content: '栄区野球協会' }],
		['meta', { property: 'og:description', content: '栄区野球協会の公式サイトです。日程・結果や協会情報を掲載しています。' }]
	],
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
