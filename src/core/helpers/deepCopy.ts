export function deepCopy(obj: any) {
	if (typeof obj !== 'object' || obj === null) {
		return obj
	}

	let copy: any

	if (obj instanceof Date) {
		copy = new Date()
		copy.setTime(obj.getTime())
	} else if (obj instanceof RegExp) {
		copy = new RegExp(obj)
	} else if (obj instanceof Map) {
		copy = new Map()

		obj.forEach((value, key) => {
			copy.set(key, deepCopy(value))
		})
	} else if (obj instanceof Set) {
		copy = new Set()

		obj.forEach((value) => {
			copy.add(deepCopy(value))
		})
	} else if (obj instanceof ImageData) {
		const { width, height, data } = obj
		const newData = new Uint8ClampedArray(data.length)

		newData.set(data)

		copy = new ImageData(newData, width, height)
	} else if (Array.isArray(obj)) {
		copy = []

		for (let i = 0; i < obj.length; i++) {
			copy[i] = deepCopy(obj[i])
		}
	} else {
		copy = {}

		Object.keys(obj).forEach((key) => {
			copy[key] = deepCopy(obj[key])
		})
	}

	return copy
}
