import { type DnDInterface } from '@/components/ElementController/interface'
import { ref, type Ref } from 'vue'
import { type Element } from '@/types'
import { Helper } from '@/components/ElementController/Helper'

export class DnD implements DnDInterface {
	#isDragging: Ref<boolean> = ref(false)
	#currentElementIndex: Ref<number | null> = ref(null)
	#helper: Helper
	#elements: Element[] | undefined

	constructor(elements: Element[] | undefined) {
		this.#helper = new Helper()
		this.#elements = elements
	}

	drag(startDragX: number, startDragY: number) {
		if (!this.#elements) {
			return
		}

		let shapeIndex = 0

		for (const element of this.#elements) {
			if (this.#helper.isMouseInShape(startDragX, startDragY, element.area)) {
				this.currentElementIndex = shapeIndex
				this.#isDragging.value = true
			}

			shapeIndex++
		}
	}

	move(currentElement: Element, dx: number, dy: number) {
		currentElement.area.x += dx
		currentElement.area.y += dy
	}

	drop() {
		if (this.isDragging) {
			this.isDragging = false
		}
	}

	get currentElementIndex() {
		return this.#currentElementIndex.value
	}

	set currentElementIndex(pointIndex: number | null) {
		this.#currentElementIndex.value = pointIndex
	}

	get isDragging() {
		return this.#isDragging.value
	}

	set isDragging(isResizing: boolean) {
		this.#isDragging.value = isResizing
	}
}
