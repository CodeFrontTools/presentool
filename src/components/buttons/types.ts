export type BaseButtonProps = {
	action: (args: any) => void
	variant: 'light' | 'colored'
	disabled?: boolean
	highlighted?: boolean
	iconName?: string
}
