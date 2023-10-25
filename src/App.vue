<script setup lang="ts">
import BaseHeader from '@/components/header/BaseHeader.vue'
import SlidesContainer from '@/components/SlidesContainer/SlidesContainer.vue'
import Workspace from '@/components/TheWorkspace.vue'
import ToolsPanel from '@/components/ToolsPanel/ToolsPanel.vue'
import type { Slide } from '@/types'
import { onMounted, ref, type Ref } from 'vue'
import { History } from '@/main'

const slides: Ref<Slide[]> = ref([
	{
		id: '0',
		elements: [
			{ type: 'rectangle', area: { x: 0, y: 0, width: 100, height: 100 }, color: 'green' },
			{ type: 'rectangle', area: { x: 10, y: 150, width: 110, height: 150 }, color: 'blue' },
		],
	},
	{
		id: '1',
		elements: [
			{ type: 'rectangle', area: { x: 300, y: 0, width: 100, height: 100 }, color: 'red' },
			{ type: 'rectangle', area: { x: 50, y: 50, width: 150, height: 150 }, color: 'blue' },
		],
	},
])

const currentSlideId: Ref<string | null> = ref(null)
const currentSlideIndex: Ref<number> = ref(-1)

onMounted(() => {
	History.init(slides)
	currentSlideIndex.value = 0
	currentSlideId.value = slides.value[currentSlideIndex.value].id
})

const handleSelectSlide = (slideId: string) => {
	currentSlideId.value = slideId
	currentSlideIndex.value = slides.value.findIndex((slide) => slide.id === slideId)
}

// FIXME - removing doesn't work properly
const handleRemoveSlide = (slideId: string) => {
	const slideIndexToRemove = slides.value.findIndex((slide) => slide.id === slideId)
	slides.value.splice(slideIndexToRemove, 1)

	currentSlideIndex.value = 0
	currentSlideId.value = slides.value[currentSlideIndex.value].id
}
</script>

<template>
	<div :class="$style.container">
		<BaseHeader />
		<div :class="$style.row">
			<SlidesContainer
				:slides="slides"
				:currentSlideId="currentSlideId"
				@selectSlide="handleSelectSlide"
				@removeSlide="handleRemoveSlide"
			/>
			<div :class="$style.column">
				<ToolsPanel />
				<Workspace :slide="slides[currentSlideIndex] || []" />
			</div>
		</div>
	</div>
</template>

<style module>
.container {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.row {
	display: flex;
	overflow: hidden;
	margin: 0 16px;
	gap: 16px;
}

.column {
	display: flex;
	flex-direction: column;
	flex: 1;
}
</style>
