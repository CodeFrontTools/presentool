import type { Element } from '@/types'

export interface DnDInterface {
	drag(startDragX: number, startDragY: number): void
	move(element: Element, dx: number, dy: number): void
	drop(): void
}
