export const PIXEL_RATIO = (function () {
	const dpr = window.devicePixelRatio || 1
	const bsr = 1

	return dpr / bsr
})()
