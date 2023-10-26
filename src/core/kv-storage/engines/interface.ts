type Nullable<T> = T | null | undefined
type CanPromise<T> = T | Promise<T>

export interface KVStorageEngine<K = unknown, V = unknown> {
	get(key: K): CanPromise<Nullable<V>>
	set(key: K, value: V): CanPromise<void>
	remove(key: K): CanPromise<void>
	onConfigured(): Promise<unknown>
}
