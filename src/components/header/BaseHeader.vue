<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseInput from '../inputs/BaseInput.vue'
import BaseIcon from '../BaseIcon.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { isFullScreenMode } from '@/components/FullscreenView/fullscreenState'
import { IndexedDBSlides } from '@/core/indexed-db/indexed-db'

const presentationName = ref<string>('')

onMounted(() => {
	IndexedDBSlides.get('presentationName').then((result) => {
		// @ts-ignore
		if (result.data) {
			// @ts-ignore
			presentationName.value = result.data
		}
	})
})

function handlePresentationNameChange(e: Event) {
	// @ts-ignore
	presentationName.value = e.target?.value.trim()
	IndexedDBSlides.set('presentationName', { data: presentationName.value })
}

function handleDownloadClick(e: Event) {
	console.log('[ handleDownloadClick ] e: ', e)
}

function handleShowSlidesClick() {
	document.addEventListener('fullscreenchange', () => {
		isFullScreenMode.value = !!document.fullscreenElement
	})

	document.documentElement.requestFullscreen()
}
</script>

<template>
	<header :class="$style['header']">
		<div :class="$style['wrapper']">
			<div :class="$style.logoContainer">
				<BaseIcon name="logo" />
			</div>
			<BaseInput
				:placeholder="'Введите название'"
				:value="presentationName"
				:variant="'flat'"
				@onChange="handlePresentationNameChange"
			/>
		</div>
		<div :class="$style['wrapper']">
			<BaseButton icon-name="export" :action="handleDownloadClick" variant="light" />
			<BaseButton icon-name="image" :action="handleShowSlidesClick" variant="colored">
				Показ слайдов
			</BaseButton>
		</div>
	</header>
</template>

<style module>
.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px;
}

.wrapper {
	display: flex;
	align-items: center;
	gap: 16px;
}

.logoContainer {
	width: 200px;
}
</style>
