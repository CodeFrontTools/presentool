<script setup lang="ts">
defineProps<{
	iconComponent?: object
	text?: string
	action: Function
	background: 'light' | 'colored'
}>()
</script>

<template>
	<button :class="[$style['base-button'], $style[`_${background}`]]" @click="action()">
		<component v-if="iconComponent" :is="iconComponent" style="width: 16px; height: 16px" />
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
.base-button._light {
	background-color: var(--pt-lighter-grey);
	color: var(--pt-blue);
	fill: var(--pt-blue);
}

.base-button._light:hover {
	background-color: var(--pt-light-grey);
}

.base-button._light:active {
	box-shadow: inset 0 0 0 1px var(--pt-grey);
}

/* Colored button */
.base-button._colored {
	background-color: var(--pt-blue);
	color: #fff;
	fill: #fff;
}

.base-button._colored:hover {
	background-color: var(--pt-darker-blue);
}

.base-button._colored:active {
	box-shadow: inset 0 0 0 1px var(--pt-darkest-blue);
}
</style>
