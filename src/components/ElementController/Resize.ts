import type { DnDInterface } from '@/components/ElementController/interface'
import { ref, type Ref } from 'vue'
import type { Element, ElementArea } from '@/types'
import { Helper } from '@/components/ElementController/Helper'

enum Points {
	TOP_LEFT,
	TOP_RIGHT,
	BOTTOM_RIGHT,
	BOTTOM_LEFT,
	TOP,
	RIGHT,
	BOTTOM,
	LEFT,
}

export class Resize implements DnDInterface {
	#currentPointIndex: Ref<number | null> = ref(null)
	#highlightPoints: ElementArea[] = []
	#isResizing: Ref<boolean> = ref(false)
	#helper: Helper

	constructor(highlightPoints: ElementArea[]) {
		this.#highlightPoints = highlightPoints
		this.#helper = new Helper()
	}

	drag(startDragX: number, startDragY: number) {
		let highlightPointIndex = 0

		for (const point of this.#highlightPoints) {
			if (this.#helper.isMouseInShape(startDragX, startDragY, point)) {
				this.currentPointIndex = highlightPointIndex
				this.#isResizing.value = true
				return
			}

			highlightPointIndex++
		}
	}

	move(currentElement: Element, dx: number, dy: number) {
		if (this.currentPointIndex === Points.TOP_LEFT) {
			currentElement.area.x += dx
			currentElement.area.y += dy
			currentElement.area.width -= dx
			currentElement.area.height -= dy
		}

		if (this.currentPointIndex === Points.TOP_RIGHT) {
			currentElement.area.width += dx
			currentElement.area.y += dy
			currentElement.area.height -= dy
		}

		if (this.currentPointIndex === Points.BOTTOM_RIGHT) {
			currentElement.area.width += dx
			currentElement.area.height += dy
		}

		if (this.currentPointIndex === Points.BOTTOM_LEFT) {
			currentElement.area.x += dx
			currentElement.area.width -= dx
			currentElement.area.height += dy
		}

		if (this.currentPointIndex === Points.TOP) {
			currentElement.area.y += dy
			currentElement.area.height -= dy
		}

		if (this.currentPointIndex === Points.RIGHT) {
			currentElement.area.width += dx
		}

		if (this.currentPointIndex === Points.BOTTOM) {
			currentElement.area.height += dy
		}

		if (this.currentPointIndex === Points.LEFT) {
			currentElement.area.x += dx
			currentElement.area.width -= dx
		}
	}

	drop() {
		if (this.isResizing) {
			this.isResizing = false
		}
		this.currentPointIndex = null
	}

	get currentPointIndex() {
		return this.#currentPointIndex.value
	}

	set currentPointIndex(pointIndex: number | null) {
		this.#currentPointIndex.value = pointIndex
	}

	get isResizing() {
		return this.#isResizing.value
	}

	set isResizing(isResizing: boolean) {
		this.#isResizing.value = isResizing
	}
}
