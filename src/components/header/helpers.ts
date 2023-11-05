import { EncodedSlide, ImageElement, Slide, SlideElement } from '@/types'

export const saveToJson = (json: any) => {
	const jsonString = JSON.stringify(json)

	const blob = new Blob([jsonString], { type: 'application/json' })
	const url = URL.createObjectURL(blob)

	const a = document.createElement('a')
	a.href = url
	a.download = 'data.json'
	a.click()

	URL.revokeObjectURL(url)
}

export const getFromJson = async () => {
	const response = await fetch(`${window.location.href}/data.json`)
	return response.json()
}

export const restoreConfig = async (slides: EncodedSlide[]): Promise<Slide[]> => {
	const slidesPromiseArr = slides.map(async (slide) => {
		const mapPromise = slide.elements.map(async (element) => {
			if (element.type === 'image') {
				const { content: filePath, ...restProp } = element
				const response = await fetch(window.location.href + filePath)
				const blob = await response.blob()
				const imageData = await blobToImageData(blob)

				if (!imageData) {
					throw new Error(`File ${filePath} not found`)
				}

				const result: ImageElement = { content: imageData, ...restProp }
				return result
			}

			return element
		})

		const restoredElements: SlideElement[] = await Promise.all(mapPromise)

		return { elements: restoredElements, id: slide.id }
	})

	return Promise.all(slidesPromiseArr)
}

export const formatConfig = (slides: Slide[]): EncodedSlide[] => {
	return slides.map((slide) => {
		const formatElements = slide.elements.map((element) => {
			if (element.type === 'image') {
				const { content: imageData, ...restProp } = element
				const fileName = 'image' + Math.floor(Math.random() * 1e6)
				setTimeout(() => {
					saveImageData(imageData, fileName)
				}, 1000)

				return { content: `images/${fileName}.png`, ...restProp }
			}

			return element
		})

		return { elements: formatElements, id: slide.id }
	})
}

export const saveImageData = (imageData: ImageData, filename: string) => {
	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')

	canvas.width = imageData.width
	canvas.height = imageData.height

	context?.putImageData(imageData, 0, 0)

	const dataUrl = canvas.toDataURL()

	const link = document.createElement('a')
	link.href = dataUrl
	link.download = filename

	link.click()
}

async function blobToImageData(blob: Blob) {
	const bitmap = await createImageBitmap(blob)

	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')

	canvas.width = bitmap.width
	canvas.height = bitmap.height

	context?.drawImage(bitmap, 0, 0)

	return context?.getImageData(0, 0, canvas.width, canvas.height)
}
