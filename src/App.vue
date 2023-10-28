<script setup lang="ts">
import BaseHeader from '@/components/header/BaseHeader.vue'
import SlidesContainer from '@/components/SlidesContainer/SlidesContainer.vue'
import Workspace from '@/components/TheWorkspace.vue'
import ToolsPanel from '@/components/ToolsPanel/ToolsPanel.vue'
import type { Slide } from '@/types'
import { onMounted, ref, type Ref } from 'vue'
import { History } from '@/main'
import Fullscreen from '@/components/FullscreenView/FullscreenView.vue'
import { isFullScreenMode } from '@/components/FullscreenView/fullscreenState'
import { IndexedDBSlides } from '@/core/indexed-db/indexed-db'

const slides: Ref<Slide[]> = ref([])

const currentSlideId: Ref<string | null> = ref(null)
const currentSlideIndex: Ref<number> = ref(-1)

onMounted(() => {
	IndexedDBSlides.get('slides').then((res) => {
		// @ts-ignore
		slides.value = res.data || []
		History.init(slides)
	})
	currentSlideIndex.value = 0
	if (slides.value[currentSlideIndex.value]) {
		currentSlideId.value = slides.value[currentSlideIndex.value].id
	}
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
	History.save()
}

const handleSlideBack = () => {
	if (currentSlideIndex.value !== 0) {
		currentSlideIndex.value--
	}
}

const handleSlideNext = () => {
	if (currentSlideIndex.value < slides.value.length) {
		currentSlideIndex.value++
	}
}
</script>

<template>
	<Fullscreen
		@back="handleSlideBack"
		@next="handleSlideNext"
		:slide="slides[currentSlideIndex]"
		v-if="isFullScreenMode"
	/>
	<div v-else :class="$style.container">
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
				<Workspace :slide="slides[currentSlideIndex]" />
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
