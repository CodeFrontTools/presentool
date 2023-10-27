import type { ElementArea } from '@/types'

export class Helper {
	isMouseInShape = (x: number, y: number, elementArea: ElementArea): boolean => {
		const { x: shapeX, y: shapeY, height, width } = elementArea
		const shapeLeft = shapeX
		const shapeTop = shapeY
		const shapeRight = shapeX + width
		const shapeBottom = shapeY + height

		return x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom
	}
}
