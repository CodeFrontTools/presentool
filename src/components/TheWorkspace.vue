<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Slide, SlideElement } from '../types'

const slides: Array<Slide> = [
	{
		id: 0,
		elements: [],
	},
]

const canvas = ref()
let canvasContext: CanvasRenderingContext2D
let imageWidth: number
let imageHeight: number
let currentSlide = 0

onMounted(() => {
	canvasContext = canvas.value.getContext('2d')
})

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
		slides[currentSlide].elements.push(newSlideElement)
	})
}

function handleCanvasClick(event: MouseEvent) {
	const rect = canvas.value.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top

	for (const { elements } of slides) {
		for (let i = elements.length - 1; i >= 0; i--) {
			const element = elements[i]
			const { area } = element

			if (area.x <= x && x <= area.x + area.width && area.y <= y && y <= area.y + area.height) {
				highlightElement(element)
				return
			}
		}
	}
}

function highlightElement(element: SlideElement) {
	const { x, y, width, height } = element.area
	const rectangle = new Path2D()
	rectangle.rect(x - 5, y - 5, width + 10, height + 10)
	canvasContext.stroke(rectangle)
}
</script>

<template>
	<canvas
		ref="canvas"
		:class="$style.canvas"
		width="700"
		height="400"
		@click="(e) => handleCanvasClick(e)"
	/>
	<input
		:class="$style['image-input']"
		type="file"
		@change="addImage(($event.target as HTMLInputElement).files![0])"
	/>
</template>

<style module>
.canvas {
	width: 700px;
	height: 400px;
	margin: 20px auto;
	border: 1px solid #f4f4f4;
	border-radius: 12px;
}

.image-input {
	position: absolute;
	right: 0;
	bottom: 50px;
	display: block;
}
</style>
