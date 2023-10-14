import StorageManager from './storage-manager'
import type { StorageOptions } from './interface'

export type { StorageOptions, KVStorageEngine, SerializableValue } from './interface'

export { default as LocalStorageEngine } from './engines/local-storage'
export { default as IDBStorageEngine } from './engines/indexed-db-storage'

export default function createStorageManager(
	namespace: string,
	opt?: StorageOptions,
): StorageManager {
	return new StorageManager(namespace, opt)
}
