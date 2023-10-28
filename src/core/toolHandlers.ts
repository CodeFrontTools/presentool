import { ref, type Ref } from 'vue'

export const injector: Ref<{
	addImage: undefined | ((file: File) => void)
	addRectangle: undefined | (() => void)
	deleteElement: undefined | (() => void)
	isTextEdit: boolean
	isDeleteElement: boolean
	fullScreenToggle: undefined | (() => void)
}> = ref({
	addImage: undefined,
	addRectangle: undefined,
	deleteElement: undefined,
	isTextEdit: false,
	isDeleteElement: false,
	fullScreenToggle: undefined,
})
