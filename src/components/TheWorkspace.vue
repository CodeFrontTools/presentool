<script setup lang="ts">
import { ref, onMounted, type Ref, watch, toRef } from 'vue'
import type {
	ElementArea,
	RectangleElement,
	Slide,
	SlideElement,
	ImageElement,
	TextElement,
	TextEditor,
} from '@/types'
import { ElementController } from '@/components/ElementController/ElementController'
import { History } from '@/main'
import { injector } from '@/core/toolHandlers'
import { createEditor } from '@/components/ElementController/Editor'
import type { OutputData } from '@editorjs/editorjs'
import { workspaceSizes } from '@/core/workspaceSizes'
import { renderText } from '@/components/helpers'
import { PIXEL_RATIO } from '@/core/canvasSize'

type WorkspaceProps = {
	slide: Slide | undefined
}

const props = defineProps<WorkspaceProps>()
const slide = toRef(props, 'slide')

watch(slide, () => {
	initialize()
})

const highlightPoints: Ref<ElementArea[]> = ref([])

const canvas = ref()
const editor = ref()
let canvasContext: CanvasRenderingContext2D
let canvasRect: DOMRect
let imageWidth: number
let imageHeight: number
let textEditor: Ref<TextEditor> = ref({
	active: false,
	editorInstance: undefined,
	top: 0,
	left: 0,
})
let clickedTextIndex: number
let elementController: ElementController | undefined
let currentElementIndex: number | undefined

const TEXT_EDITOR_LEFT_PADDING = 10
const TEXT_EDITOR_TOP_PADDING = 14
const FONT_SIZE = 18

const WIDTH = 864
const HEIGHT = 486

onMounted(() => {
	canvas.value.height = HEIGHT * PIXEL_RATIO
	canvas.value.width = WIDTH * PIXEL_RATIO
	canvas.value.style.width = WIDTH + 'px'
	canvas.value.style.height = HEIGHT + 'px'
	canvasContext = canvas.value.getContext('2d', { willReadFrequently: true })
	canvasContext.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0)
	workspaceSizes.value.height = canvas.value.height
	workspaceSizes.value.width = canvas.value.width
	injector.value.addImage = addImage
	injector.value.addRectangle = addRectangle
	injector.value.deleteElement = deleteElements
	canvasRect = canvas.value.getBoundingClientRect()
	initialize()
	window.addEventListener('click', saveText)
	canvasContext.textBaseline = 'top'
})

const initialize = () => {
	elementController = new ElementController(
		canvas.value,
		slide.value?.elements,
		highlightPoints.value,
		drawElements,
	)
	drawElements()
	injector.value.isDeleteElement = false
	currentElementIndex = undefined
}

const drawElements = () => {
	if (canvas.value === null || !slide.value?.elements) {
		return
	}

	canvasContext.clearRect(0, 0, canvas.value.width, canvas.value.height)

	for (const element of slide.value.elements) {
		if (element.type === 'rectangle') {
			canvasContext.fillStyle = element.color || ''
			canvasContext.fillRect(
				element.area.x,
				element.area.y,
				element.area.width,
				element.area.height,
			)
		} else if (element.type === 'image') {
			const canvasImage = document.createElement('canvas')
			const imageContext = canvasImage.getContext('2d')

			canvasImage.width = element.content.width
			canvasImage.height = element.content.height
			imageContext?.putImageData(element.content, 0, 0)
			canvasContext.drawImage(
				canvasImage,
				element.area.x,
				element.area.y,
				element.area.width,
				element.area.height,
			)
		} else if (element.type === 'text') {
			renderText(element.content, element.area.x, element.area.y, canvasContext, FONT_SIZE)
		}
	}
}

const deleteElements = () => {
	if (currentElementIndex != null) {
		slide.value?.elements.splice(currentElementIndex, 1)
		drawElements()
	} else {
		console.error('currentElementIndex not found')
	}

	currentElementIndex = undefined
	injector.value.isDeleteElement = false
	History.save()
}

function addImage(file: File) {
	if (!file) return

	const canvasWidth: number = canvas.value.width
	const canvasHeight: number = canvas.value.height

	const image = new Image()
	image.src = URL.createObjectURL(file)

	image.addEventListener('load', () => {
		const imageIsWider = image.width > canvasWidth
		const imageIsHigher = image.height > canvasHeight

		imageWidth = image.width
		imageHeight = image.height

		if (imageIsWider || imageIsHigher) {
			const scaleFactor = Math.min(canvasWidth / image.width, canvasHeight / image.height)

			imageWidth = image.width * scaleFactor
			imageHeight = image.height * scaleFactor
		}

		const x = (canvasWidth - imageWidth) / 2
		const y = (canvasHeight - imageHeight) / 2

		canvasContext?.drawImage(image, x, y, imageWidth, imageHeight)

		const imageData = canvasContext?.getImageData(x, y, imageWidth, imageHeight)
		const newSlideElement: ImageElement = {
			type: 'image',
			content: imageData,
			area: {
				x,
				y,
				width: imageWidth,
				height: imageHeight,
			},
		}

		slide.value?.elements.push(newSlideElement)
		History.save()
		highlightElement(newSlideElement)
	})
}

const addRectangle = () => {
	const newSlideElement: RectangleElement = {
		type: 'rectangle',
		color: 'blue',
		area: {
			x: 0,
			y: 0,
			width: 100,
			height: 100,
		},
	}
	slide.value?.elements.push(newSlideElement)
	drawElements()
	History.save()
}

function handleCanvasClick(event: MouseEvent) {
	if (
		!slide.value ||
		event.clientX < canvasRect.left ||
		event.clientX > canvasRect.right ||
		event.clientY < canvasRect.top ||
		event.clientY > canvasRect.bottom
	) {
		return
	}

	const x = event.clientX - canvasRect.left
	const y = event.clientY - canvasRect.top

	for (let i = slide.value.elements.length - 1; i >= 0; i--) {
		const element = slide.value.elements[i]
		const { area } = element

		if (area.x <= x && x <= area.x + area.width && area.y <= y && y <= area.y + area.height) {
			drawElements()
			highlightElement(element)
			saveText()
			destroyTextEditor()
			if (element.type === 'text' && injector.value.isTextEdit) {
				editText(element, area.x + canvasRect.left, area.y + canvasRect.top)
			}
			currentElementIndex = i
			injector.value.isDeleteElement = true
			return element
		} else {
			if (textEditor.value.active) {
				saveText()
			}
			destroyTextEditor()
			currentElementIndex = undefined
			injector.value.isDeleteElement = false

			drawElements()
		}
	}

	saveText()
	injector.value.isTextEdit && addTextEditor(event.clientX, event.clientY)
}

function highlightElement(element: SlideElement) {
	const { width, height } = element.area
	const { x, y } =
		element.type === 'text'
			? {
					x: element.area.x - TEXT_EDITOR_LEFT_PADDING,
					y: element.area.y - TEXT_EDITOR_TOP_PADDING,
			  }
			: element.area

	canvasContext.fillStyle = '#1a73e8'
	canvasContext.strokeStyle = '#1a73e8'
	canvasContext.strokeRect(x, y, width, height)

	canvasContext.strokeStyle = '#fff'
	const size = 8
	const newHighlightPoints: ElementArea[] = [
		{ x: x - size / 2, y: y - size / 2, width: size, height: size },
		{ x: x + width - size / 2, y: y - size / 2, width: size, height: size },
		{ x: x + width - size / 2, y: y + height - size / 2, width: size, height: size },
		{ x: x - size / 2, y: y + height - size / 2, width: size, height: size },
		{ x: x + width / 2 - size / 2, y: y - size / 2, width: size, height: size },
		{ x: x + width - size / 2, y: y + height / 2 - size / 2, width: size, height: size },
		{ x: x + width / 2 - size / 2, y: y + height - size / 2, width: size, height: size },
		{ x: x - size / 2, y: y + height / 2 - size / 2, width: size, height: size },
	]

	for (let i = 0; i < newHighlightPoints.length; i++) {
		const point = newHighlightPoints[i]
		canvasContext.fillRect(point.x, point.y, size, size)
		canvasContext.strokeRect(point.x, point.y, size, size)
		highlightPoints.value[i] = point
	}
}

function addTextEditor(x: number, y: number) {
	textEditor.value = {
		editorInstance: createEditor('editor'),
		top: y,
		left: x,
		active: true,
	}
}

function saveText() {
	if (textEditor.value.active && textEditor.value.editing) {
		saveTextEditorOnEdit()
	} else if (textEditor.value.active) {
		saveTextEditor()
	}
}

function saveTextEditor() {
	const editorWidth = +getComputedStyle(editor.value).width.slice(0, -2)
	const editorHeight = +getComputedStyle(editor.value).height.slice(0, -2)
	let coordX = textEditor.value.left - canvasRect.left + TEXT_EDITOR_LEFT_PADDING
	let coordY = textEditor.value.top - canvasRect.top + TEXT_EDITOR_TOP_PADDING

	textEditor.value.editorInstance &&
		textEditor.value.editorInstance
			.save()
			.then((outputData) => {
				if (outputData.blocks.length === 0) {
					destroyTextEditor()
					return
				}

				const newSlideElement: TextElement = {
					type: 'text',
					content: outputData,
					area: {
						x: coordX,
						y: coordY,
						width: editorWidth,
						height: editorHeight,
					},
				}
				slide.value?.elements.push(newSlideElement)

				renderText(outputData, coordX, coordY, canvasContext, FONT_SIZE)
				textEditor.value.width = getTextWidth(outputData)
				destroyTextEditor()
				History.save()
			})
			.catch((error: Error) => {
				console.log('Saving failed: ', error)
			})
}

function editText(element: TextElement, x: number, y: number) {
	if (!slide.value) {
		return
	}
	const { content } = element
	clickedTextIndex = slide.value.elements.indexOf(element)
	;(slide.value.elements[clickedTextIndex] as TextElement).content = null

	drawElements()

	injector.value.isTextEdit = true
	textEditor.value = {
		editorInstance: createEditor('editor', content),
		top: y - TEXT_EDITOR_TOP_PADDING,
		left: x - TEXT_EDITOR_LEFT_PADDING,
		editing: true,
		active: true,
	}
}

function saveTextEditorOnEdit() {
	const element = slide.value?.elements[clickedTextIndex] as TextElement
	const editorWidth = +getComputedStyle(editor.value).width.slice(0, -2)
	const editorHeight = +getComputedStyle(editor.value).height.slice(0, -2)
	let coordX = textEditor.value.left - canvasRect.left + TEXT_EDITOR_LEFT_PADDING
	let coordY = textEditor.value.top - canvasRect.top + TEXT_EDITOR_TOP_PADDING

	textEditor.value.editorInstance &&
		textEditor.value.editorInstance
			.save()
			.then((outputData) => {
				if (outputData.blocks.length === 0) {
					destroyTextEditor()
					return
				}

				element.content = outputData
				element.area.width = editorWidth
				element.area.height = editorHeight

				renderText(outputData, coordX, coordY, canvasContext, FONT_SIZE)
				textEditor.value.width = getTextWidth(outputData)
				destroyTextEditor()
				History.save()
			})
			.catch((error: Error) => {
				console.log('Saving failed: ', error)
			})
}

function getTextWidth(data: OutputData) {
	let max = 0

	data.blocks.forEach(({ type, data }) => {
		if (type === 'paragraph') {
			max = Math.max(...[max, data.text])
		} else if (type === 'list') {
			max = Math.max(...[max, ...data.items])
		}
	})

	return max
}

function destroyTextEditor() {
	if (typeof textEditor.value.editorInstance === 'undefined') {
		return
	}

	if ('destroy' in textEditor.value.editorInstance) {
		injector.value.isTextEdit = false
		textEditor.value.active = false
		textEditor.value.editorInstance?.destroy()
	}
}
</script>

<template>
	<div :class="$style.container">
		<canvas
			ref="canvas"
			id="workspace"
			@mousedown.prevent="elementController?.drag"
			@mouseup.prevent="elementController?.drop"
			@mouseout.prevent="elementController?.drop"
			@mousemove.prevent="elementController?.move"
			:class="$style.canvas"
			@click.prevent.stop="(e) => handleCanvasClick(e)"
		/>
	</div>
	<div
		ref="editor"
		id="editor"
		:class="[$style.editor, textEditor.active ? $style['editor_active'] : '']"
		:style="{
			top: textEditor.top + 'px',
			left: textEditor.left + 'px',
			width: textEditor.width + 'px',
			'font-size': FONT_SIZE + 'px',
			'padding-left': TEXT_EDITOR_LEFT_PADDING + 'px',
		}"
		@click.stop
	/>
</template>

<style module>
.container {
	position: relative;
	margin: 20px auto;
}

.canvas {
	border: 1px solid var(--pt-light-grey);
	border-radius: var(--pt-border-radius);
	box-sizing: content-box;
}

.image-input {
	display: block;
	margin: 30px auto 0;
}

.editor {
	position: absolute;
	display: none;
	width: fit-content;
	min-width: 80px;
	max-width: 600px; /* вычислять нормально */
	height: fit-content;
	border: 1px solid #1a73e8;
}

.editor_active {
	display: block;
}
</style>
