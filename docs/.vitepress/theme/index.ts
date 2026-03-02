import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { nextTick } from 'vue'
import './style.css'

export default {
	extends: DefaultTheme,
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
