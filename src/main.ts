import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { IndexedDBSlides } from '@/core/indexed-db/indexed-db'
import { HistoryManager } from '@/components/HistoryManager'

const app = createApp(App)
export const History = new HistoryManager({ limit: 20 })

IndexedDBSlides.onConfigured().then(() => {
	app.use(router)

	app.mount('#app')
})
