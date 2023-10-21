<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '../inputs/BaseInput.vue'
import BaseIcon from '../BaseIcon.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'

const presentationName = ref<string>('')

function handlePresentationNameChange(name: string) {
	presentationName.value = name.trim()
}

function handleDownloadClick(e: Event) {
	console.log('[ handleDownloadClick ] e: ', e)
}

function handleShowSlidesClick(e: Event) {
	console.log('[ handleShowSlidesClick ] e: ', e)
}
</script>

<template>
	<header :class="$style['header']">
		<div :class="$style['wrapper']">
			<BaseIcon name="logo" />
			<BaseInput
				:placeholder="'Введите название'"
				:value="presentationName"
				:variant="'flat'"
				:onChange="handlePresentationNameChange"
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
</style>
