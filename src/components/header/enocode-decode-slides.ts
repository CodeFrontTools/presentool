import { EncodedSlide, Slide } from '@/types'

export const encode = (slides: Slide[]): EncodedSlide[] => {
	return slides.map((slide) => {
		const encodedElements = slide.elements.map((element) => {
			if (element.type === 'image') {
				const { content: imageData, ...restProp } = element
				const encodedData = {
					width: imageData.width,
					height: imageData.height,
					data: [] as number[],
				}

				for (let i = 0; i < imageData.data.length; i++) {
					encodedData.data.push(imageData.data[1])
				}

				const base64Data = btoa(JSON.stringify(encodedData))

				return { content: base64Data, ...restProp }
			}

			return element
		})

		return { elements: encodedElements, id: slide.id }
	})
}

export const decode = (slides: EncodedSlide[]): Slide[] => {
	return slides.map((slide) => {
		const decodedElements = slide.elements.map((element) => {
			if (element.type === 'image') {
				const { content, ...restProps } = element
				const decodedData = atob(element.content)

				const { width, height, data } = JSON.parse(decodedData) as {
					width: number
					height: number
					data: number[]
				}

				return {
					content: new ImageData(new Uint8ClampedArray(data), width, height),
					...restProps,
				}
			}

			return element
		})

		return { elements: decodedElements, id: slide.id }
	})
}

export const saveToJson = (json: any) => {
	const jsonString = JSON.stringify(json)
	// const encodedJson = JSON.stringify({ json: btoa(jsonString) })

	const blob = new Blob([jsonString], { type: 'application/json' })
	const url = URL.createObjectURL(blob)

	const a = document.createElement('a')
	a.href = url
	a.download = 'data.json'
	a.click()

	URL.revokeObjectURL(url)
}

export const getFromJson = () => {
	fetch(`${window.location.href}public/data.json`)
		.then((res) => {
			return res.json()
		})
		.then((data) => {
			console.log('atob', JSON.parse(data))
			// console.log(decode(JSON.parse(atob(data)) as EncodedSlide[]))
		})
		.catch((err) => console.log(err))
}
