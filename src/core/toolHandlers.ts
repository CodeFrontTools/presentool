import { ref, type Ref } from 'vue'

export const injector: Ref<{
	addImage: undefined | ((file: File) => void)
	addRectangle: undefined | (() => void)
	isTextEdit: boolean
	fullScreenToggle: undefined | (() => void)
}> = ref({
	addImage: undefined,
	addRectangle: undefined,
	isTextEdit: false,
	fullScreenToggle: undefined,
})
