import { ref } from 'vue'
import type { Ref } from 'vue'
import type { SlideElement } from '@/types'

export class DnDElements {
	#canvas!: HTMLCanvasElement
	#elements!: SlideElement[]
	#startDragX!: Ref<number | null>
	#startDragY!: Ref<number | null>
	#currentElementIndex: Ref<number | null> = ref(null)
	#isDragging: Ref<boolean> = ref(false)
	#drawElements!: () => void

	init(canvas: HTMLCanvasElement, elements: SlideElement[], drawElements: () => void) {
		this.#canvas = canvas
		this.#elements = elements
		this.#startDragX = ref(null)
		this.#startDragY = ref(null)
		this.#drawElements = drawElements
	}

	drag(event: MouseEvent) {
		const rect = this.#canvas.getBoundingClientRect()
		this.#startDragX.value = event.clientX - rect.left
		this.#startDragY.value = event.clientY - rect.top
		let shapeIndex = 0

		for (const element of this.#elements) {
			if (this.#isMouseInShape(this.#startDragX.value, this.#startDragY.value, element)) {
				this.#currentElementIndex.value = shapeIndex
				this.#isDragging.value = true
			}

			shapeIndex++
		}
	}

	drop() {
		if (this.#isDragging.value) {
			this.#isDragging.value = false
		}
	}

	move(event: MouseEvent) {
		if (!this.#isDragging.value) {
			return
		}

		if (
			this.#startDragX.value === null ||
			this.#startDragY.value === null ||
			this.#currentElementIndex.value === null
		) {
			return
		}

		const rect = this.#canvas.getBoundingClientRect()
		const mouseX = event.clientX - rect.left
		const mouseY = event.clientY - rect.top
		const dx = mouseX - this.#startDragX.value
		const dy = mouseY - this.#startDragY.value
		const currentElement = this.#elements[this.#currentElementIndex.value]
		currentElement.area.x += dx
		currentElement.area.y += dy

		this.#drawElements()

		this.#startDragX.value = mouseX
		this.#startDragY.value = mouseY
	}

	#isMouseInShape = (x: number, y: number, shape: SlideElement): boolean => {
		const { x: shapeX, y: shapeY, height, width } = shape.area
		const shapeLeft = shapeX
		const shapeTop = shapeY
		const shapeRight = shapeX + width
		const shapeBottom = shapeY + height

		return x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom
	}
}
