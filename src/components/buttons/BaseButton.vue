<script setup lang="ts">
import Icon from '../BaseIcon.vue'

defineProps<{
	action: (args: any) => void
	style: 'light' | 'colored'
	disabled?: boolean
	iconName?: string
}>()
</script>

<template>
	<button
		:class="[$style['base-button'], $style[`base-button_${style}`]]"
		:disabled="disabled"
		@click="action"
	>
		<Icon v-if="iconName" :name="iconName" />
		<slot></slot>
	</button>
</template>

<style module>
.base-button {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 8px;
	vertical-align: middle;
	font-weight: 800;
	font-size: 13px;
	text-align: center;
	border-radius: var(--pt-border-radius);
	transition: background-color 0.2s;
}

/* Light button */
.base-button_light {
	background-color: var(--pt-lighter-grey);
	color: var(--pt-blue);
	fill: var(--pt-blue);
}

.base-button_light:not(:disabled):hover {
	background-color: var(--pt-light-grey);
}

.base-button_light:not(:disabled):active {
	box-shadow: inset 0 0 0 1px var(--pt-grey);
}

/* Colored button */
.base-button_colored {
	background-color: var(--pt-blue);
	color: #fff;
	fill: #fff;
}

.base-button_colored:not(:disabled):hover {
	background-color: var(--pt-darker-blue);
}

.base-button_colored:not(:disabled):active {
	box-shadow: inset 0 0 0 1px var(--pt-darkest-blue);
}

/* Disabled button */
.base-button:disabled {
	opacity: 0.5;
	cursor: default;
}
</style>
