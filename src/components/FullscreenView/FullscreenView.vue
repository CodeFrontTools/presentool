<script setup lang="ts">
import type { Slide } from '@/types'
import { onMounted, ref, toRef, watch } from 'vue'
import { workspaceSizes } from '@/core/workspaceSizes'

const props = defineProps<{ slide: Slide }>()
const slide = toRef(props, 'slide')

watch(slide, () => {
	drawElements()
})

onMounted(() => {
	const coefficient = screen.width / workspaceSizes.value.width
	canvas.value.width = screen.width
	canvas.value.height = coefficient * workspaceSizes.value.height
	canvasContext = canvas.value.getContext('2d', { willReadFrequently: true })
	drawElements()
})

const drawElements = () => {
	const coefficient = screen.width / 1040

	if (canvas.value === null || !slide.value) {
		return
	}

	canvasContext.clearRect(0, 0, canvas.value.width, canvas.value.height)

	for (const element of slide.value.elements) {
		if (element.type === 'rectangle') {
			canvasContext.fillStyle = element.color || ''
			canvasContext.fillRect(
				element.area.x * coefficient,
				element.area.y * coefficient,
				element.area.width * coefficient,
				element.area.height * coefficient,
			)
		} else if (element.type === 'image') {
			const canvasImage = document.createElement('canvas')
			const imageContext = canvasImage.getContext('2d')

			canvasImage.width = element.content.width
			canvasImage.height = element.content.height
			imageContext?.putImageData(element.content, 0, 0)
			canvasContext.drawImage(
				canvasImage,
				element.area.x * coefficient,
				element.area.y * coefficient,
				element.area.width * coefficient,
				element.area.height * coefficient,
			)
		}
	}
}

const canvas = ref()
let canvasContext: CanvasRenderingContext2D
</script>

<template>
	<canvas ref="canvas" />
</template>

<style module></style>
