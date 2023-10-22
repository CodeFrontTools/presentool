import { ref } from 'vue'
import type { Ref } from 'vue'
import type { ElementArea, SlideElement } from '@/types'
import { Resize } from '@/components/ElementController/Resize'
import { DnD } from '@/components/ElementController/DnD'

export class ElementController {
	#canvas: HTMLCanvasElement
	#elements: SlideElement[]
	#startDragX: Ref<number | undefined>
	#startDragY: Ref<number | undefined>
	#drawElements: () => void
	#Resize: Resize
	#DnD: DnD

	constructor(
		canvas: HTMLCanvasElement,
		elements: SlideElement[],
		highlightPoints: ElementArea[],
		drawElements: () => void,
	) {
		this.#canvas = canvas
		this.#elements = elements
		this.#startDragX = ref()
		this.#startDragY = ref()
		this.#drawElements = drawElements

		this.#DnD = new DnD(elements)
		this.#Resize = new Resize(highlightPoints)
	}

	drag(event: MouseEvent) {
		const rect = this.#canvas.getBoundingClientRect()
		this.#startDragX.value = event.clientX - rect.left
		this.#startDragY.value = event.clientY - rect.top

		this.#Resize.drag(this.#startDragX.value, this.#startDragY.value)

		if (this.#Resize.isResizing) {
			return
		}

		this.#DnD.drag(this.#startDragX.value, this.#startDragY.value)
	}

	drop() {
		this.#DnD.drop()
		this.#Resize.drop()
	}

	move(event: MouseEvent) {
		if (!this.#DnD.isDragging && !this.#Resize.isResizing) {
			return
		}

		if (
			!this.#startDragX.value ||
			!this.#startDragY.value ||
			this.#DnD.currentElementIndex === null
		) {
			return
		}

		const rect = this.#canvas.getBoundingClientRect()
		const mouseX = event.clientX - rect.left
		const mouseY = event.clientY - rect.top
		const dx = mouseX - this.#startDragX.value
		const dy = mouseY - this.#startDragY.value
		const currentElement = this.#elements[this.#DnD.currentElementIndex]

		if (this.#Resize.isResizing) {
			this.#Resize.move(currentElement, dx, dy)
		}

		if (this.#DnD.isDragging) {
			this.#DnD.move(currentElement, dx, dy)
		}

		this.#drawElements()

		this.#startDragX.value = mouseX
		this.#startDragY.value = mouseY
	}
}
