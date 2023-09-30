// TODO make more secure hash function
export function generateId(): string {
	const id = Math.floor(Math.random() * 10e8)
	return String(id)
}
