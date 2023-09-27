<script setup lang="ts">
import SlideFrame from '@/components/SlidesContainer/SlideFrame.vue'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { SlideData } from '@/components/SlidesContainer/types'
import { generateId } from '@/components/SlidesContainer/helpers'
import BaseButton from '@/components/buttons/BaseButton.vue'

const slides: Ref<SlideData[]> = ref([
	{ id: '1' },
	{ id: '2' },
	{ id: '3' },
	{ id: '4' },
	{ id: '5' },
	{ id: '6' },
])
const selectedSlide = ref<string>('1')

function selectSlide(slideNumber: string) {
	selectedSlide.value = slideNumber
}

function addSlide() {
	slides.value.push({ id: generateId() })
}
</script>

<template>
	<div :class="$style.container">
		<BaseButton icon-name="plus" :action="addSlide" :style="'light'" :class="[$style.button]"
			>Добавить слайд</BaseButton
		>
		<div :class="$style.slidesContainer">
			<SlideFrame
				v-for="(slide, index) in slides"
				:class="[$style.slideItem]"
				:key="slide.id"
				:slideNumber="index + 1"
				:selected="selectedSlide === slide.id"
				@click="selectSlide(slide.id)"
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
