export type Slide = {
	id: number
	elements: Array<SlideElement>
}

export type SlideElement = {
	type: 'image' | 'text'
	content: ImageData | string
	area: {
		x: number
		y: number
		width: number
		height: number
	}
}
