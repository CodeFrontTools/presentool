<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Slide, SlideElement } from '../types'

const slides: Array<Slide> = [
	{
		id: 0,
		elements: [],
	},
]

const lower = ref()
const upper = ref()
let lowerCanvas: CanvasRenderingContext2D
let upperCanvas: CanvasRenderingContext2D
let imageWidth: number
let imageHeight: number
let currentSlide = 0

onMounted(() => {
	upperCanvas = upper.value.getContext('2d')
})

function addImage(file: File) {
	if (!file) return

	const canvasWidth: number = upper.value.width
	const canvasHeight: number = upper.value.height

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

		upperCanvas?.drawImage(image, x, y, imageWidth, imageHeight)

		const imageData = upperCanvas?.getImageData(x, y, imageWidth, imageHeight)
		const newSlideElement: SlideElement = {
			type: 'image',
			area: {
				x1: x,
				x2: canvasWidth - x,
				y1: y,
				y2: canvasHeight - y,
			},
			content: imageData,
		}
		slides[currentSlide].elements.push(newSlideElement)
	})
}

function handleCanvasClick(event: MouseEvent) {
	const rect = upper.value.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top

	let clickedElement: SlideElement | null = null

	for (const { elements } of slides) {
		for (let i = elements.length - 1; i >= 0; i--) {
			const element = elements[i]
			const { area } = element
			console.log('iter')

			if (area.x1 <= x && x <= area.x2 && area.y1 <= y && y <= area.y2) {
				clickedElement = element
				return
			}
		}
	}
}
</script>

<template>
	<!-- <canvas ref="lower" :class="$style.canvas" width="700" height="400" /> -->
	<canvas
		ref="upper"
		:class="$style.canvas"
		width="700"
		height="400"
		@click="(e) => handleCanvasClick(e)"
	/>
	<input
		:class="'image-btn'"
		type="file"
		@change="addImage(($event.target as HTMLInputElement).files![0])"
	/>
</template>

<style module>
.canvas {
	margin: 20px auto;
	border: 1px solid rebeccapurple;
}
</style>
