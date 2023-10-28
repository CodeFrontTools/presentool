<script setup lang="ts">
import ToolsButton from '@/components/ToolsPanel/ToolsButton.vue'
import { History } from '@/main'
import { type Ref, ref } from 'vue'
import { injector } from '@/core/toolHandlers'
const uploadInput: Ref<HTMLInputElement | null> = ref(null)

const uploadImage = () => {
	if (uploadInput.value == null) {
		return
	}

	uploadInput.value?.addEventListener('change', handleUploadInputChange)
	uploadInput.value.click()
	editTextFinish()
}

const handleUploadInputChange = () => {
	if (uploadInput.value == null) {
		return
	}

	const files = uploadInput.value.files![0]

	if (injector.value.addImage) {
		injector.value.addImage(files)
	}

	if (uploadInput.value) {
		uploadInput.value.removeEventListener('change', handleUploadInputChange)
	}
}

const addRectangle = () => {
	if (injector.value.addRectangle) {
		injector.value.addRectangle()
	}
	editTextFinish()
}

const editText = () => {
	injector.value.isTextEdit = true
}

const editTextFinish = () => {
	injector.value.isTextEdit = false
}

const deleteElement = () => {
	if (injector.value.deleteElement) {
		injector.value.deleteElement()
	}
}
</script>

<template>
	<div :class="$style.toolsPanel">
		<ToolsButton icon-name="arrow-left" :action="() => History.undo()" />
		<ToolsButton icon-name="arrow-right" :action="() => History.redo()" />
		<div :class="$style.delimiter" />
		<ToolsButton icon-name="font" :highlighted="injector.isTextEdit" :action="editText" />
		<ToolsButton icon-name="image-tool" :action="uploadImage" />
		<ToolsButton icon-name="copy" :action="addRectangle" />
		<input ref="uploadInput" type="file" hidden />
		<ToolsButton v-if="injector.isDeleteElement" icon-name="remove-18px" :action="deleteElement" />
	</div>
</template>

<style module>
.toolsPanel {
	display: flex;
	align-items: center;
	height: 32px;
	padding: 5px 12px;
	background-color: var(--pt-lighter-grey);
	border-radius: var(--pt-border-radius);
}

.delimiter {
	width: 1px;
	height: 16px;
	margin: 0 10px;
	background-color: #bababa;
}
</style>
