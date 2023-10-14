import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { IndexedDBSlides } from '@/core/indexed-db/indexed-db'

const app = createApp(App)

IndexedDBSlides.onConfigured().then(() => {
	app.use(router)

	app.mount('#app')
})
