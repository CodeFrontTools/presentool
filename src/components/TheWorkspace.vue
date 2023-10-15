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

const canvas = ref()
let canvasContext: CanvasRenderingContext2D
let imageWidth: number
let imageHeight: number
let currentSlide = 0

const DnD = new DnDElements()

onMounted(() => {
	canvasContext = canvas.value.getContext('2d')
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

	let clickedElement: SlideElement | null = null

	for (const { elements } of slides.value) {
		for (let i = elements.length - 1; i >= 0; i--) {
			const element = elements[i]
			const { area } = element

			if (area.x <= x && x <= area.x + area.width && area.y <= y && y <= area.y + area.height) {
				clickedElement = element
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
