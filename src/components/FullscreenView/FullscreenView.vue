<script setup lang="ts">
import type { Slide } from '@/types'
import { onMounted, onUnmounted, type Ref, ref, toRef, watch } from 'vue'
import { workspaceSizes } from '@/core/workspaceSizes'
import { FONT_SIZE } from '@/components/constants'
import { drawElements } from '@/components/helpers'
import { PIXEL_RATIO } from '@/core/canvasSize'

const props = defineProps<{ slide: Slide }>()
const emit = defineEmits<{ back: []; next: [] }>()
const slide = toRef(props, 'slide')
const scale: Ref<number> = ref(0)
const fontSize: Ref<number> = ref(0)

watch(slide, () => {
	drawElements(canvas.value, canvasContext, slide.value, scale.value, fontSize.value)
})

const keyHandler = (e: KeyboardEvent) => {
	if (e.key === 'ArrowLeft') {
		emit('back')
	} else if (e.key === 'ArrowRight') {
		emit('next')
	}
}

onMounted(() => {
	scale.value = (screen.width / workspaceSizes.value.width) * PIXEL_RATIO
	fontSize.value = FONT_SIZE * scale.value

	canvas.value.width = screen.width * PIXEL_RATIO
	canvas.value.height = workspaceSizes.value.height * scale.value * PIXEL_RATIO
	canvas.value.style.width = screen.width + 'px'
	canvas.value.style.height = scale.value * workspaceSizes.value.height + 'px'
	canvasContext = canvas.value.getContext('2d', { willReadFrequently: true })
	canvasContext.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0)

	drawElements(canvas.value, canvasContext, slide.value, scale.value, fontSize.value)
	document.addEventListener('keydown', keyHandler)
})

onUnmounted(() => {
	document.removeEventListener('keydown', keyHandler)
})

const canvas = ref()
let canvasContext: CanvasRenderingContext2D
</script>

<template>
	<div :class="$style.wrapper">
		<canvas :class="$style.canvas" ref="canvas" />
	</div>
</template>

<style module>
.wrapper {
	background-color: black;
}

.canvas {
	background-color: white;
}
</style>
