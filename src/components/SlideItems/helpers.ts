export function generateId(): string {
	const id = Math.floor(Math.random() * 10e6)
	return String(id)
}
