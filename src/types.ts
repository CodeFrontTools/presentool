export type Slide = {
	id: string
	elements: Array<SlideElement>
}

export type SlideElement = ImageElement | TextElement | RectangleElement

export type RectangleElement = Element & {
	type: 'rectangle'
	color: string
}

export type ImageElement = Element & {
	type: 'image'
	content: ImageData
}

export type TextElement = Element & {
	type: 'text'
	content: string
}

export type ElementArea = {
	x: number
	y: number
	width: number
	height: number
}

export type Element = {
	area: ElementArea
}
