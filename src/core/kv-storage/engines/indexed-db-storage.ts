import type { KVStorageEngine } from '@/core/kv-storage'
import type { ObjectOf } from '@/core/types'

export default class IDBStorageEngine implements KVStorageEngine<string, ObjectOf<unknown>> {
	#db!: IDBDatabase
	readonly #storageName: string
	resolver!: (value: unknown) => void

	constructor(dbName: string, storageName: string, options?: IDBObjectStoreParameters) {
		this.#storageName = storageName
		const request = indexedDB.open(dbName)

		request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
			this.#db = (event.target as IDBOpenDBRequest).result

			if (!this.#db.objectStoreNames.contains(this.#storageName)) {
				this.#db.createObjectStore(this.#storageName, { ...options })
			}
		}

		request.onsuccess = (event) => {
			this.#db = (event.target as IDBOpenDBRequest).result
			this.resolver('success')
		}
	}

	get(key: any): ReturnType<KVStorageEngine<string, ObjectOf<unknown>>['get']> {
		const transaction = this.#db.transaction(this.#storageName)
		const objectStore = transaction.objectStore(this.#storageName)
		const request = objectStore.get(key)

		return new Promise((resolve, reject) => {
			request.onsuccess = () => {
				resolve(request.result)
			}

			request.onerror = () => {
				console.error(
					`An error occurred while getting data by key "${key}". Error: ${request.error}`,
				)
				reject(request.error)
			}
		})
	}

	set(
		key: string,
		value: ObjectOf<unknown>,
	): ReturnType<KVStorageEngine<string, ObjectOf<unknown>>['set']> {
		const transaction = this.#db.transaction(this.#storageName, 'readwrite')
		const objectStore = transaction.objectStore(this.#storageName)

		const valueToPut = { ...value, id: key }
		const request = objectStore.put(valueToPut)
		return new Promise((resolve, reject) => {
			request.onsuccess = () => {
				resolve()
			}

			request.onerror = () => {
				console.error(
					`An error occurred while setting data by key "${key}". Error: ${request.error}`,
				)
				reject(request.error)
			}
		})
	}

	remove(key: string): ReturnType<KVStorageEngine['remove']> {
		const transaction = this.#db.transaction(this.#storageName)
		const objectStore = transaction.objectStore(this.#storageName)
		const request = objectStore.delete(key)

		return new Promise((resolve, reject) => {
			request.onsuccess = () => {
				resolve()
			}

			request.onerror = () => {
				console.error(
					`An error occurred while removing data by key "${key}". Error: ${request.error}`,
				)
				reject(request.error)
			}
		})
	}

	onConfigured() {
		return new Promise((resolve) => {
			this.resolver = resolve
		})
	}
}
