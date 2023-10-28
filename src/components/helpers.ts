import { font, FONT_SIZE_DICT } from '@/components/constants'
import { OutputData } from '@editorjs/editorjs'
import { Slide } from '@/types'

export const drawElements = (
	canvas: HTMLCanvasElement,
	canvasContext: CanvasRenderingContext2D,
	slide: Slide,
	scale: number = 1,
	fontSize: number,
) => {
	if (canvas === null || !slide) {
		return
	}

	canvasContext.clearRect(0, 0, canvas.width, canvas.height)

	for (const element of slide.elements) {
		if (element.type === 'rectangle') {
			canvasContext.fillStyle = element.color || ''
			canvasContext.fillRect(
				element.area.x * scale,
				element.area.y * scale,
				element.area.width * scale,
				element.area.height * scale,
			)
		} else if (element.type === 'image') {
			const canvasImage = document.createElement('canvas')
			const imageContext = canvasImage.getContext('2d')

			canvasImage.width = element.content.width
			canvasImage.height = element.content.height
			imageContext?.putImageData(element.content, 0, 0)
			canvasContext.drawImage(
				canvasImage,
				element.area.x * scale,
				element.area.y * scale,
				element.area.width * scale,
				element.area.height * scale,
			)
		} else if (element.type === 'text') {
			renderText(
				element.content,
				element.area.x * scale,
				element.area.y * scale,
				canvasContext,
				fontSize,
			)
		}
	}
}

export function renderText(
	data: OutputData | null,
	x: number,
	y: number,
	canvasContext: CanvasRenderingContext2D,
	fontSize: number,
) {
	if (!data) return

	let initY = y
	canvasContext.fillStyle = '#383838'
	canvasContext.font = `normal ${font(fontSize)}`
	;(data as OutputData).blocks.forEach(({ type, data }) => {
		if (type === 'paragraph') {
			console.log(data.text)
			stylizeTextForCanvas(data.text, x, initY, canvasContext, fontSize)
			initY = initY + 43
		} else if (type === 'list') {
			data.items.forEach((item: { content: string }) => {
				canvasContext.fillText(item.content, x, initY)
				initY = initY + 38
			})
		}
	})
}

export function stylizeTextForCanvas(
	text: string,
	x: number,
	y: number,
	canvasContext: CanvasRenderingContext2D,
	fontSize: number,
) {
	let currentX = x
	const currentY = y
	let readingTag = false
	let readingTagContent = false
	let step = 1
	let fontSizeId: number
	const stack = new Array(text.length)

	for (let i = 0; i < text.length; i += step) {
		step = 1

		if (readingTag) {
			const closeTagIndex = text.substring(i).indexOf('>')

			if (text[i] === '/') {
				stack.pop()
				readingTag = false
			} else {
				if (text[i] === 'f') {
					stack.push('font')
					fontSizeId = +text
						.slice(i)
						.slice(1, closeTagIndex)
						.match(/size="(\d)"/)![1]
				} else {
					stack.push(text[i])
				}
				readingTag = false
				readingTagContent = true
			}

			step = closeTagIndex

			continue
		}

		if (readingTagContent) {
			const currentTag = stack[stack.length - 1]
			const style = ['bold', 'italic', 'font'].find((s) => s.match(currentTag))
			// @ts-ignore
			if (typeof fontSizeId !== 'undefined') {
				fontSize = FONT_SIZE_DICT[fontSizeId - 1]
			}
			console.log(fontSize)
			canvasContext.font = `${style} ${font(fontSize)}`
			console.log(canvasContext.font)

			const endContentIndex = text.slice(i).indexOf('<')
			const content = text.slice(i).slice(1, endContentIndex)
			canvasContext.fillText(content, currentX, currentY)
			const { width: textWidth, fontBoundingBoxDescent: baseline } =
				canvasContext.measureText(content)

			if (!style) {
				// numbers do not fit to any font size
				switch (currentTag) {
					case 'u':
						canvasContext.fillRect(currentX, currentY + baseline - fontSize / 6, textWidth, 1)
						break
					case 's':
						canvasContext.fillRect(currentX, currentY + fontSize / 2 - 1, textWidth, 1)
						break

					default:
						break
				}
			}

			currentX += canvasContext.measureText(content).width
			// @ts-ignore
			const closingTagChars = fontSizeId ? 8 : 5
			step = content.length + closingTagChars // 4 is the number of chars in a closing tag: </b>
			canvasContext.font = `normal ${font(fontSize)}`
			readingTagContent = false

			continue
		}

		if (text[i] === '<') {
			readingTag = true
		} else {
			canvasContext.fillText(text[i], currentX, currentY)
			currentX += canvasContext.measureText(text[i]).width
		}
	}

	return false
}
