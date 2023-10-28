<script setup lang="ts">
import type { Slide } from '@/types'
import { onMounted, onUnmounted, type Ref, ref, toRef, watch } from 'vue'
import { workspaceSizes } from '@/core/workspaceSizes'
import { FONT_SIZE } from '@/components/constants'
import { drawElements } from '@/components/helpers'

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
	scale.value = screen.width / workspaceSizes.value.width
	fontSize.value = FONT_SIZE * scale.value

	canvas.value.width = screen.width
	canvas.value.height = scale.value * workspaceSizes.value.height
	canvasContext = canvas.value.getContext('2d', { willReadFrequently: true })
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
	<canvas ref="canvas" />
</template>

<style module></style>
