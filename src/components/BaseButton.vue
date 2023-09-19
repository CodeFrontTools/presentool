<script setup lang="ts">
import Icon from './BaseIcon.vue'

defineProps<{
	action: Function
	background: 'light' | 'colored'
	iconName?: string
	text?: string
}>()
</script>

<template>
	<button :class="[$style['base-button'], $style[`base-button_${background}`]]" @click="action()">
		<Icon v-if="iconName" :name="iconName" />
		<span v-if="text" :class="$style['base-button__text']">{{ text }}</span>
	</button>
</template>

<style module>
.base-button {
	display: inline-flex;
	align-items: center;
	padding: 8px;
	border-radius: var(--pt-border-radius);
	vertical-align: middle;
	transition: background-color 0.2s;
}

.base-button__text {
	margin-left: 4px;
	font-weight: 800;
	font-size: 13px;
	text-align: center;
}

/* Light button */
.base-button_light {
	background-color: var(--pt-lighter-grey);
	color: var(--pt-blue);
	fill: var(--pt-blue);
}

.base-button_light:hover {
	background-color: var(--pt-light-grey);
}

.base-button_light:active {
	box-shadow: inset 0 0 0 1px var(--pt-grey);
}

/* Colored button */
.base-button_colored {
	background-color: var(--pt-blue);
	color: #fff;
	fill: #fff;
}

.base-button_colored:hover {
	background-color: var(--pt-darker-blue);
}

.base-button_colored:active {
	box-shadow: inset 0 0 0 1px var(--pt-darkest-blue);
}
</style>
