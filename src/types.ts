export type Slide = {
	id: number
	elements: Array<SlideElement>
}

export type SlideElement = {
	type: 'image' | 'text'
	area: {
		x1: number
		x2: number
		y1: number
		y2: number
	}
	content: ImageData | string
}
