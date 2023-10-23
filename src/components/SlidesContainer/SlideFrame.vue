<script setup lang="ts">
defineProps<{
	slideNumber: number
	selected: boolean
	name: string
}>()
</script>

<template>
	<div :class="[$style.container]">
		<div :class="[$style.slideNumber]">{{ slideNumber }}</div>
		<div :class="[$style.miniature, selected ? $style.selected : '']">
			{{ name }}
		</div>
	</div>
</template>

<style module>
.container {
	display: flex;
	justify-content: end;
	padding-right: 16px;
}

.slideNumber {
	text-align: end;
	font-size: 14px;
	font-weight: 600;
}

.miniature {
	width: 157px;
	height: 92px;

	display: flex;
	align-items: center;
	justify-content: center;

	margin-left: 8px;
	border: 1px solid var(--pt-light-grey);
	border-radius: var(--pt-border-radius);

	color: var(--pt-md-grey);

	cursor: pointer;

	&:hover {
		border: 1px solid var(--pt-blue);
		box-shadow: 0px 0px 4px -1px var(--pt-blue);
	}
}

.selected {
	border: 2px solid var(--pt-blue);
}
</style>
