<script setup lang="ts">
import { toRef, ref } from 'vue'
import SlideFrame from '@/components/SlidesContainer/SlideFrame.vue'
import { generateId } from '@/components/SlidesContainer/helpers'
import BaseButton from '@/components/buttons/BaseButton.vue'
import type { Slide } from '@/types'

const props = defineProps<{ slides: Slide[]; currentSlideId: string | null }>()
const emit = defineEmits<{ selectSlide: [slideId: string]; removeSlide: [slideId: string] }>()

const slides = toRef(props, 'slides')

function selectSlide(slideId: string) {
	emit('selectSlide', slideId)
}

function addSlide() {
	slides.value.push({ id: generateId(), elements: [] })
}

const removeSlide = (slideId: string) => {
	emit('removeSlide', slideId)
}

const dragging = ref(-1)

const dragStart = (index: number, evt: DragEvent) => {
	evt.dataTransfer!.setData('Text', index.toString())
	evt.dataTransfer!.dropEffect = 'move'
	dragging.value = index
}

const dragEnter = (item: number, evt: { target: HTMLInputElement }) => {
	const className = evt.target.className
	const isMiniature = className.includes('miniature')

	if (dragging.value !== item && isMiniature) {
		evt.target.style.backgroundColor = '#e3e3e3'
	}
}

const dragLeave = (item: number, evt: { target: HTMLInputElement }) => {
	evt.target.style.backgroundColor = 'white'
}

const dragEnd = () => {
	dragging.value = -1
}

const moveItem = (from: number, to: number) => {
	if (to === -1) return

	slides.value.splice(to, 0, slides.value.splice(from, 1)[0])
}

const dragFinish = (to: number, evt: { target: HTMLInputElement }) => {
	moveItem(dragging.value, to)
	evt.target.style.backgroundColor = 'white'
}
</script>

<template>
	<div :class="$style.container">
		<BaseButton icon-name="plus" :action="addSlide" variant="light" :class="[$style.button]">
			Добавить слайд</BaseButton
		>
		<div :class="$style.slidesContainer">
			<SlideFrame
				v-for="(slide, index) in slides"
				:class="$style.slideItem"
				:key="slide.id"
				:slide-index="slide.id"
				:slideNumber="index + 1"
				:selected="currentSlideId === slide.id"
				@mousedown="selectSlide(slide.id)"
				draggable="true"
				@dragstart="dragStart(index, $event)"
				@dragenter="dragEnter(index, $event)"
				@dragleave="dragLeave(index, $event)"
				@dragend="dragEnd"
				@drop="dragFinish(index, $event)"
				@dragover.prevent
				@dragenter.prevent
				@remove="removeSlide"
			/>
		</div>
	</div>
</template>

<style module>
.container {
	display: flex;
	flex-direction: column;
	overflow: auto;
	width: 200px;
	height: 100%;
}

.button {
	width: 200px;
	margin-bottom: 16px;
}

.slidesContainer {
	height: 100%;
	overflow-x: auto;
}

.slideItem:not(:last-child) {
	margin-bottom: 16px;
}
</style>
