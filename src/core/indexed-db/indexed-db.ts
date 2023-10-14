import createStorageManager, { IDBStorageEngine } from '@/core/kv-storage'
const PT_INDEXED_DB_KEY = 'pt-key'
const DB_NAME = 'PT-DB'
const slidesStorageObjectName = 'slides'

export const IndexedDBSlides = createStorageManager(PT_INDEXED_DB_KEY, {
	engine: new IDBStorageEngine(DB_NAME, slidesStorageObjectName, { keyPath: 'id' }),
})
