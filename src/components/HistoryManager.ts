import { type Ref, ref } from 'vue'
import { deepCopy } from '@/core/helpers/deepCopy'

type HistoryOptions = {
	limit?: number
}

let instance: HistoryManager<any>
const DEFAULT_LIMIT = 5

//TODO переделать на LinkedList
//FIXME баг при очищении оствших элементов
export class HistoryManager<T> {
	#historyStack: T[]
	#currentState!: Ref<T>
	#currentHistoryIndex: number
	#limit: number

	constructor(options?: HistoryOptions) {
		if (instance) {
			throw new Error('Only one HistoryManger allowed')
		}
		instance = this
		this.#historyStack = []
		this.#limit = options?.limit || DEFAULT_LIMIT
		this.#currentHistoryIndex = -1
	}

	init(state: Ref<T>) {
		this.#currentState = state
		this.save()
	}

	save() {
		const savedValue: Ref<T> = ref(deepCopy(this.#currentState.value))
		if (this.canRedo) {
			const restHistoryElements = this.#historyStack.length - 1 - this.#currentHistoryIndex

			this.#historyStack = deepCopy(
				this.#historyStack.splice(-restHistoryElements, restHistoryElements),
			)
		}

		if (this.#historyStack.length >= this.#limit) {
			this.#historyStack.shift()
		}

		this.#historyStack.push(deepCopy(savedValue.value))
		this.#currentHistoryIndex = this.#historyStack.length - 1
	}

	undo() {
		if (this.canUndo) {
			this.#currentHistoryIndex--
			this.#currentState.value = deepCopy(this.#historyStack[this.#currentHistoryIndex])
		}
	}

	redo() {
		if (this.canRedo) {
			this.#currentHistoryIndex++
			this.#currentState.value = deepCopy(this.#historyStack[this.#currentHistoryIndex])
		}
	}

	get canUndo() {
		return this.#historyStack.length !== 0 && this.#currentHistoryIndex > 0
	}

	get canRedo() {
		return (
			this.#historyStack.length !== 0 && this.#currentHistoryIndex < this.#historyStack.length - 1
		)
	}
}
