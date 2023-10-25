<script setup lang="ts">
import { toRef } from 'vue'
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
				:selected="currentSlideId === slide.id"
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
