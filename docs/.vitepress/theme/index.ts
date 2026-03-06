import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { h, nextTick } from 'vue'
import NewsArticleNav from './components/NewsArticleNav.vue'
import './style.css'

export default {
	extends: DefaultTheme,
	Layout() {
		return h(DefaultTheme.Layout, null, {
			'doc-after': () => h(NewsArticleNav)
		})
	},
	enhanceApp({ router }) {
		if (typeof window === 'undefined') {
			return
		}

		let zoom: ReturnType<typeof mediumZoom> | null = null
		const root = document.documentElement

		const applyZoom = () => {
			zoom?.detach()
			zoom = null

			const isNewsPage = /\/news(\/|$)/.test(window.location.pathname)
			root.classList.toggle('news-zoom-enabled', isNewsPage)

			if (isNewsPage) {
				zoom = mediumZoom('.vp-doc img')
			}
		}

		router.onAfterRouteChanged = () => {
			nextTick(() => {
				applyZoom()
			})
		}

		nextTick(() => {
			applyZoom()
		})
	}
}
