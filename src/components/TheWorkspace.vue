<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'
import type { Slide, SlideElement } from '../types'
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

const canvas = ref()
let canvasContext: CanvasRenderingContext2D
let imageWidth: number
let imageHeight: number
let currentSlide = 0

const DnD = new DnDElements()

onMounted(() => {
	canvasContext = canvas.value.getContext('2d', { willReadFrequently: true })
	DnD.init(canvas.value, slides.value[currentSlide].elements, drawElements)
	drawElements()
})

const drawElements = () => {
	if (canvasContext === null || canvas.value === null) {
		return
	}

	canvasContext.clearRect(0, 0, canvas.value.width, canvas.value.height)

	for (const element of slides.value[currentSlide].elements) {
		if (element.type === 'rectangle') {
			canvasContext.fillStyle = element.color || ''
			canvasContext.fillRect(element.area.x, element.area.y, element.area.width, element.area.height)
		} else if (element.type === 'image') {
			canvasContext.putImageData(element.content, element.area.x, element.area.y)
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
		slides.value[currentSlide].elements.push(newSlideElement)
	})
}

function handleCanvasClick(event: MouseEvent) {
	const rect = canvas.value.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top

	for (const { elements } of slides.value) {
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

	canvasContext.fillStyle = '#1a73e8'
	canvasContext.strokeStyle = '#1a73e8'
	canvasContext.strokeRect(x, y, width, height)

	canvasContext.strokeStyle = '#fff'
	canvasContext.fillRect(x - 4, y - 4, 8, 8)
	canvasContext.strokeRect(x - 4, y - 4, 8, 8)
	canvasContext.fillRect(x + width - 4, y - 4, 8, 8)
	canvasContext.strokeRect(x + width - 4, y - 4, 8, 8)
	canvasContext.fillRect(x + width - 4, y + height - 4, 8, 8)
	canvasContext.strokeRect(x + width - 4, y + height - 4, 8, 8)
	canvasContext.fillRect(x - 4, y + height - 4, 8, 8)
	canvasContext.strokeRect(x - 4, y + height - 4, 8, 8)

	canvasContext.fillRect(x + width / 2 - 4, y - 4, 8, 8)
	canvasContext.strokeRect(x + width / 2 - 4, y - 4, 8, 8)
	canvasContext.fillRect(x + width - 4, y + height / 2 - 4, 8, 8)
	canvasContext.strokeRect(x + width - 4, y + height / 2 - 4, 8, 8)
	canvasContext.fillRect(x + width / 2 - 4, y + height - 4, 8, 8)
	canvasContext.strokeRect(x + width / 2 - 4, y + height - 4, 8, 8)
	canvasContext.fillRect(x - 4, y + height / 2 - 4, 8, 8)
	canvasContext.strokeRect(x - 4, y + height / 2 - 4, 8, 8)
}
</script>

<template>
	<div :class="$style.container">
		<canvas
			ref="canvas"
			@mousedown.prevent="DnD.drag"
			@mouseup.prevent="DnD.drop"
			@mouseout.prevent="DnD.drop"
			@mousemove.prevent="DnD.move"
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
