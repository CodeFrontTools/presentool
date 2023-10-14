import type { KVStorageEngine } from './interface'

export default class LocalStorageEngine implements KVStorageEngine {
	get(key: string): ReturnType<KVStorageEngine['get']> {
		return localStorage.getItem(key)
	}

	set(key: string, value: string): ReturnType<KVStorageEngine['set']> {
		return localStorage.setItem(key, value)
	}

	remove(key: string): ReturnType<KVStorageEngine['remove']> {
		return localStorage.removeItem(key)
	}

	onConfigured(): Promise<'success'> {
		return Promise.resolve('success')
	}
}
