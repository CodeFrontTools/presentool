import DefaultEngine from './engines'

import type { KVStorageEngine, StorageOptions, SerializableValue } from './interface'

export default class StorageManager {
	readonly namespace: string
	readonly #engine: KVStorageEngine
	#resolver: (() => void) | null = null

	constructor(namespace: string, opt?: StorageOptions) {
		this.namespace = namespace
		this.#engine = opt?.engine ?? new DefaultEngine()

		this.#engine.onConfigured().then(() => {
			if (this.#resolver) {
				this.#resolver()
			}
		})
	}

	async get<T extends SerializableValue>(name: string) {
		return this.#engine.get(name)
	}

	async set(name: string, value: SerializableValue): Promise<void> {
		await this.#engine.set(name, value)
	}

	async remove(name: string): Promise<void> {
		await this.#engine.remove(name)
	}

	async onConfigured(): Promise<void> {
		return new Promise((resolve) => {
			this.#resolver = resolve
		})
	}

	#getKey(key: string) {
		return `[[${this.namespace}]]-${key}`
	}
}
