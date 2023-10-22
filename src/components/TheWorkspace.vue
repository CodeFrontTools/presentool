<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'
import type { ElementArea, Slide, SlideElement } from '@/types'
import { ElementController } from '@/components/ElementController/ElementController'

const slide: Ref<Slide> = ref({
	id: 0,
	elements: [
		{ type: 'rectangle', area: { x: 0, y: 0, width: 100, height: 100 }, color: 'red' },
		{ type: 'rectangle', area: { x: 50, y: 50, width: 150, height: 150 }, color: 'blue' },
	],
})

const highlightPoints: Ref<ElementArea[]> = ref([])

const canvas = ref()
let canvasContext: CanvasRenderingContext2D
let imageWidth: number
let imageHeight: number

let elementController: ElementController | undefined

onMounted(() => {
	canvasContext = canvas.value.getContext('2d', { willReadFrequently: true })
	elementController = new ElementController(
		canvas.value,
		slide.value.elements,
		highlightPoints.value,
		drawElements,
	)
	drawElements()
})

const drawElements = () => {
	if (canvas.value === null) {
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
		}
	}
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
		const newSlideElement: SlideElement = {
			type: 'image',
			content: imageData,
			area: {
				x,
				y,
				width: imageWidth,
				height: imageHeight,
			},
		}
		slide.value.elements.push(newSlideElement)
	})
}

function handleCanvasClick(event: MouseEvent) {
	const rect = canvas.value.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top

	for (let i = slide.value.elements.length - 1; i >= 0; i--) {
		const element = slide.value.elements[i]
		const { area } = element

		if (area.x <= x && x <= area.x + area.width && area.y <= y && y <= area.y + area.height) {
			drawElements()
			highlightElement(element)
			return
		} else {
			drawElements()
		}
	}
}

function highlightElement(element: SlideElement) {
	const { x, y, width, height } = element.area

	canvasContext.fillStyle = '#1a73e8'
	canvasContext.strokeStyle = '#1a73e8'
	canvasContext.strokeRect(x, y, width, height)

	canvasContext.strokeStyle = '#fff'
	const size = 8
	const newHighlightPoints: ElementArea[] = [
		{ x: x - 4, y: y - 4, width: size, height: size },
		{ x: x + width - 4, y: y - 4, width: size, height: size },
		{ x: x + width - 4, y: y + height - 4, width: size, height: size },
		{ x: x - 4, y: y + height - 4, width: size, height: size },
		{ x: x + width / 2 - 4, y: y - 4, width: size, height: size },
		{ x: x + width - 4, y: y + height / 2 - 4, width: size, height: size },
		{ x: x + width / 2 - 4, y: y + height - 4, width: size, height: size },
		{ x: x - 4, y: y + height / 2 - 4, width: size, height: size },
	]

	for (let i = 0; i < newHighlightPoints.length; i++) {
		const point = newHighlightPoints[i]
		canvasContext.fillRect(point.x, point.y, size, size)
		canvasContext.strokeRect(point.x, point.y, size, size)
		highlightPoints.value[i] = point
	}
}
</script>

<template>
	<div :class="$style.container">
		<canvas
			ref="canvas"
			@mousedown.prevent="elementController?.drag"
			@mouseup.prevent="elementController?.drop"
			@mouseout.prevent="elementController?.drop"
			@mousemove.prevent="elementController?.move"
			:class="$style.canvas"
			width="700"
			height="400"
			@click.prevent="(e) => handleCanvasClick(e)"
		/>
		<input
			:class="$style['image-input']"
			type="file"
			@change="addImage(($event.target as HTMLInputElement).files![0])"
		/>
	</div>
</template>

<style module>
.container {
	position: relative;
	margin: 20px auto;
}

.canvas {
	width: 700px;
	height: 400px;
	border: 1px solid var(--pt-light-grey);
	border-radius: var(--pt-border-radius);
	box-sizing: content-box;
}

.image-input {
	display: block;
	margin: 30px auto 0;
}
</style>
