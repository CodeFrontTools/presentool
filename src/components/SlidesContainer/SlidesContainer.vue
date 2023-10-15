<script setup lang="ts">
import { ref } from 'vue'
import SlideFrame from '@/components/SlidesContainer/SlideFrame.vue'
import { generateId } from '@/components/SlidesContainer/helpers'
import BaseButton from '@/components/buttons/BaseButton.vue'
import type { SlideData } from '@/components/SlidesContainer/types'

const slides = ref<SlideData[]>([
	{ id: '1' },
	{ id: '2' },
	{ id: '3' },
	{ id: '4' },
	{ id: '5' },
	{ id: '6' },
])
const selectedSlide = ref('1')

function selectSlide(slideNumber: string) {
	selectedSlide.value = slideNumber
}

function addSlide() {
	slides.value.push({ id: generateId() })
}

const removeSlide = (id: string) => {
	const slideIndex = slides.value.findIndex((item) => item.id === id)
	slides.value.splice(slideIndex, 1)
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
				:class="[$style.slideItem]"
				:key="slide.id"
				:slide-index="slide.id"
				:slideNumber="index + 1"
				:selected="selectedSlide === slide.id"
				@click="selectSlide(slide.id)"
				@remove="removeSlide"
			/>
		</div>
	</div>
</template>

<style module>
.container {
	display: inline-flex;
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
