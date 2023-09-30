<script setup lang="ts">
defineProps<{
	slideNumber: number
	selected: boolean
}>()
</script>

<template>
	<div :class="[$style.container]">
		<div :class="[$style.slideNumber]">{{ slideNumber }}</div>
		<div :class="[$style.miniature, selected ? $style.selected : '']"></div>
	</div>
</template>

<style module>
.container {
	display: flex;
	justify-content: end;
}

.slideNumber {
	text-align: end;
	font-size: 14px;
	font-weight: 600;
}

.miniature {
	width: 157px;
	height: 92px;

	margin-left: 8px;
	border: 1px solid var(--pt-light-grey);
	border-radius: var(--pt-border-radius);
}

.selected {
	border: 2px solid var(--pt-blue);
}
</style>
