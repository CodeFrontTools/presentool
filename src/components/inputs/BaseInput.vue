<script setup lang="ts">
defineProps<{
	onChange: (value: any) => void
	disabled?: boolean
	placeholder?: string
	type?: string
	value?: string
	variant?: 'flat' | 'border'
}>()
</script>

<template>
	<input
		:class="[$style.input, $style[`input_${variant}`]]"
		:disabled="disabled"
		:placeholder="placeholder || ''"
		:value="value"
		:type="type || 'text'"
		@click="onChange"
	/>
</template>

<style module>
.input {
	padding: 8px;
	font-weight: 400;
	font-size: 13px;
	border-radius: var(--pt-border-radius);
}

.input_border {
	border: 1px solid var(--pt-light-grey);
}

.input_flat {
	border: none;
}

.input:not(:disabled):hover {
	border-color: var(--pt-grey);
	cursor: pointer;
}

.input_flat:not(:disabled):hover,
.input:not(:disabled):active {
	box-shadow: inset 0 0 0 1px var(--pt-grey);
}

.input:disabled {
	opacity: 0.5;
	cursor: default;
}
</style>
