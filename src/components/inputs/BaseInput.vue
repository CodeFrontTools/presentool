<script setup lang="ts">
defineProps<{
	disabled?: boolean
	placeholder?: string
	type?: string
	value?: string
	variant?: 'flat' | 'border'
}>()
const emit = defineEmits<{ onChange: [e: Event] }>()
const onChangeHandler = (e: Event) => {
	emit('onChange', e)
}
</script>

<template>
	<input
		:class="[$style.input, $style[`input_${variant}`]]"
		:disabled="disabled"
		:placeholder="placeholder || ''"
		:value="value"
		:type="type || 'text'"
		@input="onChangeHandler"
	/>
</template>

<style module>
.input {
	padding: 8px;
	font-weight: 400;
	font-size: 13px;
	border: 1px solid;
	border-radius: var(--pt-border-radius);
}

.input_border {
	border-color: var(--pt-light-grey);
}

.input_flat {
	border-color: transparent;
}

.input:not(:disabled):hover {
	border-color: var(--pt-grey);
	cursor: text;
}

.input_flat:not(:disabled):hover,
.input:not(:disabled):active {
	border-color: var(--pt-grey);
}

.input:disabled {
	opacity: 0.5;
	cursor: default;
}
</style>
