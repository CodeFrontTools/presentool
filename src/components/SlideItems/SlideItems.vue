<script setup lang="ts">
import SlideItem from '@/components/SlideItems/SlideItem.vue'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { SlideItemData } from '@/components/SlideItems/types'
import { generateId } from '@/components/SlideItems/helpers'

const slides: Ref<SlideItemData[]> = ref([
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
		<button @click.left="addSlide" :class="[$style.button]">+ Добавить слайд</button>
		<div :class="$style.slidesContainer">
			<SlideItem
				v-for="(slide, index) in slides"
				:class="[$style.slideItem]"
				:key="slide.id"
				:number="index + 1"
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
