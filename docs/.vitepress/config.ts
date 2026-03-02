import { defineConfig } from 'vitepress'

export default defineConfig({
	lang: 'ja-JP',
	title: '横浜市 栄区野球協会',
	description: '栄区野球大会の最新情報、日程、試合結果、協会概要を掲載しています。',
	head: [
		['meta', { name: 'keywords', content: '春季市民野球大会, 市民野球, 試合結果, 日程, アマチュア野球' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:title', content: '春季市民野球大会 公式サイト' }],
		['meta', { property: 'og:description', content: '市民が主役の春季市民野球大会の公式サイトです。日程・結果や協会情報を掲載しています。' }]
	],
	themeConfig: {
		nav: [
				{ text: 'トップ', link: '/' },
				{ text: '日程・試合結果', link: '/schedule/' },
				{ text: '協会概要', link: '/association' }
		],
		socialLinks: [
			{ icon: 'twitter', link: 'https://x.com/SakaeBaseball' },
            { icon: 'facebook', link: 'https://www.facebook.com/sakae.baseball' },
		],
		footer: {
			message: '栄区野球協会',
			copyright: '© 2000,Sakae Baseball Association.'
		}
	}
})
