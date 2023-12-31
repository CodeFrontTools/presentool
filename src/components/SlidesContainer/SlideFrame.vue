<script setup lang="ts">
import { onMounted, ref, toRef, watch } from 'vue'
import type { Slide } from '@/types'
import { drawElements } from '@/components/helpers'
import { FONT_SIZE } from '@/components/constants'
import BaseIcon from '../BaseIcon.vue'
import { PIXEL_RATIO } from '@/core/canvasSize'

type SlideItemProps = {
	slideNumber: number
	slideIndex: string
	selected: boolean
	slide: Slide
}

type SlideItemEmits = {
	remove: [id: string]
}

const props = defineProps<SlideItemProps>()
const emits = defineEmits<SlideItemEmits>()
const slide = toRef(props, 'slide')

const canvas = ref()
const scale = ref(0)
const fontSize = ref(0)
let canvasContext: CanvasRenderingContext2D

const WIDTH = 157
const HEIGHT = 92

onMounted(() => {
	const workspace = document.querySelector('#workspace')

	console.log(getComputedStyle(workspace!).width)
	const workspaceWidth = 1728
	// const workspaceWidth = +getComputedStyle(workspace!).width.slice(0, -2)
	scale.value = (WIDTH / workspaceWidth) * PIXEL_RATIO

	fontSize.value = FONT_SIZE * scale.value
	canvas.value.width = WIDTH * PIXEL_RATIO
	canvas.value.height = HEIGHT * PIXEL_RATIO

	canvas.value.style.width = WIDTH + 'px'
	canvas.value.style.height = HEIGHT + 'px'

	canvasContext = canvas.value.getContext('2d', { willReadFrequently: true })
	canvasContext.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0)

	drawElements(canvas.value, canvasContext, slide.value, scale.value, fontSize.value)
})

const remove = () => {
	emits('remove', props.slideIndex)
}

watch(
	slide,
	() => {
		drawElements(canvas.value, canvasContext, slide.value, scale.value, fontSize.value)
	},
	{ deep: true },
)
</script>

<template>
	<div :class="[$style.containerSlide]">
		<div :class="[$style.wrapper]">
			<div :class="[$style.slideNumber]">{{ slideNumber }}</div>
			<button :class="[$style.btnRemove]" @click="remove">
				<BaseIcon name="remove" />
			</button>
		</div>
		<div :class="[$style.miniature, selected ? $style.selected : '']">
			<canvas ref="canvas" :class="$style.miniCanvas" />
		</div>
	</div>
</template>

<style module scoped>
.btnRemove {
	width: 11px;
	height: 11px;
	opacity: 0;
}

.containerSlide {
	display: flex;
	justify-content: end;

	&:hover {
		.btnRemove {
			transition: 0.5s;
			opacity: 1;
		}
	}
}

.slideNumber {
	text-align: end;
	font-size: 14px;
	font-weight: 600;
}

.miniature {
	width: 157px;
	height: 88px;

	display: flex;
	align-items: center;
	justify-content: center;

	margin-left: 8px;
	border: 1px solid var(--pt-light-grey);
	border-radius: var(--pt-border-radius);
	overflow: hidden;

	color: var(--pt-md-grey);

	cursor: pointer;

	&:hover {
		border: 1px solid var(--pt-blue);
		box-shadow: 0px 0px 4px -1px var(--pt-blue);
	}
}

.selected {
	border: 2px solid var(--pt-blue);

	&:hover {
		border: 2px solid var(--pt-blue);
		box-shadow: 0px 0px 4px -1px var(--pt-blue);
	}
}

.miniCanvas {
	width: 100%;
	height: 100%;
}
</style>
