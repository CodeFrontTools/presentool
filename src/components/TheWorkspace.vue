<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import type { Slide, SlideElement } from '@/types'
import { DnDElements } from '@/components/DnD'

const slides: Ref<Array<Slide>> = ref([
	{
		id: 0,
		elements: [
			{ type: 'rectangle', area: { x: 0, y: 0, width: 100, height: 100 }, color: 'red' },
			{ type: 'rectangle', area: { x: 50, y: 50, width: 150, height: 150 }, color: 'blue' },
		],
	},
])

const lower = ref()
const upper = ref()
let lowerCanvas: CanvasRenderingContext2D
let upperCanvas: CanvasRenderingContext2D
let imageWidth: number
let imageHeight: number
let currentSlide = 0

const DnD = new DnDElements()

onMounted(() => {
	upperCanvas = upper.value.getContext('2d')
	DnD.init(upper.value, slides.value[currentSlide].elements, drawElements)
	drawElements()
})

const drawElements = () => {
	if (upperCanvas === null || upper.value === null) {
		return
	}

	upperCanvas.clearRect(0, 0, upper.value.width, upper.value.height)

	for (const element of slides.value[currentSlide].elements) {
		if (element.type === 'rectangle') {
			upperCanvas.fillStyle = element.color || ''
			upperCanvas.fillRect(element.area.x, element.area.y, element.area.width, element.area.height)
		} else if (element.type === 'image') {
			upperCanvas.putImageData(element.content, element.area.x, element.area.y)
		}
	}
}

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
				x: x,
				y: y,
				width: canvasWidth,
				height: canvasHeight,
			},
			content: imageData,
		}
		slides.value[currentSlide].elements.push(newSlideElement)
	})
}

function handleCanvasClick(event: MouseEvent) {
	const rect = upper.value.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top

	let clickedElement: SlideElement | null = null

	for (const { elements } of slides.value) {
		for (let i = elements.length - 1; i >= 0; i--) {
			const element = elements[i]
			const { area } = element
			console.log('iter')

			if (area.x <= x && x <= area.x + area.width && area.y <= y && y <= area.y + area.height) {
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
		@mousedown.prevent="DnD.drag"
		@mouseup.prevent="DnD.drop"
		@mouseout.prevent="DnD.drop"
		@mousemove.prevent="DnD.move"
		:class="$style.canvas"
		width="700"
		height="400"
		@click.prevent="(e) => handleCanvasClick(e)"
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
