import EditorJS, { type OutputData } from '@editorjs/editorjs'

export type EncodedSlide = { elements: EncodedSlideElement[] } & Omit<Slide, 'elements'>
type EncodedSlideElement = EncodedImageElement | TextElement | RectangleElement
type EncodedImageElement = { content: string } & Omit<ImageElement, 'content'>

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
	content: OutputData | null
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

export type TextEditor = {
	editorInstance: EditorJS | undefined
	top: number
	left: number
	active: boolean
	editing?: boolean
	width?: number
}
