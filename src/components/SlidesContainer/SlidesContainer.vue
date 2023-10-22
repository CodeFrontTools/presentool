<script setup lang="ts">
import SlideFrame from '@/components/SlidesContainer/SlideFrame.vue'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { SlideData } from '@/components/SlidesContainer/types'
import { generateId } from '@/components/SlidesContainer/helpers'
import BaseButton from '@/components/buttons/BaseButton.vue'

const slides: Ref<SlideData[]> = ref([
	{ id: '1', name: 'Слайд 1' },
	{ id: '2', name: 'Слайд 2' },
	{ id: '3', name: 'Слайд 3' },
	{ id: '4', name: 'Слайд 4' },
	{ id: '5', name: 'Слайд 5' },
	{ id: '6', name: 'Слайд 6' },
])
const selectedSlide = ref('1')

function selectSlide(slideNumber: string) {
	selectedSlide.value = slideNumber
}

function addSlide() {
	slides.value.push({ id: generateId(), name: `str${generateId()}` })
}

const dragging = ref(-1)

const dragStart = (index: number, evt: DragEvent) => {
	evt.dataTransfer!.setData('Text', index.toString())
	evt.dataTransfer!.dropEffect = 'move'
	dragging.value = index
}
const isDragOver = ref(false);

const dragEnter = (index: number, evt: { target: HTMLInputElement }) => {
	isDragOver.value = true;
}

const dragLeave = (index: number, evt: { target: HTMLInputElement }) => {
	
	isDragOver.value = false;
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
}

</script>

<template>
	<div :class="$style.container">
		<BaseButton icon-name="plus" :action="addSlide" variant="light" :class="[$style.button]"
			>Добавить слайд</BaseButton
		>
		<div :class="$style.slidesContainer">
			<SlideFrame
				v-for="(slide, index) in slides"
				:class="[$style.slideItem, isDragOver ? $style.hover : '']"
				:key="slide.id"
				:slideNumber="index + 1"
				:name="slide.name"
				:selected="selectedSlide === slide.id"
				@mousedown="selectSlide(slide.id)"
				@dragover.prevent
				draggable="true"
				@dragstart.stop="dragStart(index, $event)"
				@dragenter.stop="dragEnter(index, $event)"
				@dragleave.="dragLeave(index, $event)"				
				@dragend="dragEnd"
				@drop="dragFinish(index, $event)"
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

.hover {
	background-color: deeppink;
}
</style>
