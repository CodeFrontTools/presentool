<script setup lang="ts">
import SlideFrame from '@/components/SlidesContainer/SlideFrame.vue'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { SlideData } from '@/components/SlidesContainer/types'
import { generateId } from '@/components/SlidesContainer/helpers'
import BaseButton from '@/components/buttons/BaseButton.vue'

const slides: Ref<SlideData[]> = ref([
	{ id: '1', name: 'str1' },
	{ id: '2', name: 'str2' },
	{ id: '3', name: 'str3' },
	{ id: '4', name: 'str4' },
	{ id: '5', name: 'str5' },
	{ id: '6', name: 'str6' },
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

const dragEnd = () => {
	dragging.value = -1
}

const moveItem = (from: number, to: number) => {
	if (to === -1) return

	slides.value.splice(to, 0, slides.value.splice(from, 1)[0])
}

const dragFinish = (to: number, evt: { target: HTMLInputElement }) => {
	moveItem(dragging.value, to)
	evt.target!.style.marginTop = '2px'
	evt.target!.style.marginBottom = '2px'
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
				:class="[$style.slideItem]"
				:key="slide.id"
				:slideNumber="index + 1"
				:name="slide.name"
				:selected="selectedSlide === slide.id"
				@click="selectSlide(slide.id)"
				draggable="true"
				@dragstart="dragStart(index, $event)"
				@dragover.prevent
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
</style>
