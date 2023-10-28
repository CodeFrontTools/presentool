import { Slide } from '@/types'

export const FONT_SIZE_DICT = [10, 13, 16, 18, 24, 32, 48]
export const FONT_SIZE = FONT_SIZE_DICT[3]

export const font = (size: number) =>
	`${size}px 'Manrope', system-ui, 'SF Pro Display', Roboto, Oxygen, Arial, sans-serif`

export const INIT_SLIDES: Slide[] = [{ id: '1', elements: [] }]
