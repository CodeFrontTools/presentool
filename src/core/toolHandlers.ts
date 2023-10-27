import { ref, type Ref } from 'vue'

export const handlersInjector: Ref<{
	addImage: undefined | ((file: File) => void)
	addRectangle: undefined | (() => void)
}> = ref({
	addImage: undefined,
	addRectangle: undefined,
})
