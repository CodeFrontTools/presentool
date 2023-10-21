import type { KVStorageEngine } from './engines'

export type { KVStorageEngine } from './engines'

export interface StorageOptions {
	engine?: KVStorageEngine
}

export type SerializablePrimitiveValue = string | number | boolean | null

export type SerializableValue =
	| SerializablePrimitiveValue
	| SerializablePrimitiveValue[]
	| Record<string, SerializablePrimitiveValue>
	| { toJSON(): SerializableValue }
