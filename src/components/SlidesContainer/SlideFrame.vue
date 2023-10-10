<template>
	<div :class="[$style.container]">
		<div :class="[$style.slideNumber]">{{ slideNumber }}</div>
		<div :class="[$style.miniature, selected ? $style.selected : '']">
			<button :class="[$style.btnRemove]" @click="remove">Remove</button>
		</div>
	</div>
</template>

<script setup lang="ts">
type SlideItemProps = {
	slideNumber: number
	slideIndex: string
	selected: boolean
}

type SlideItemEmits = {
	remove: [id: string]
}

const props = defineProps<SlideItemProps>()
const emits = defineEmits<SlideItemEmits>()

const remove = () => {
	emits('remove', props.slideIndex)
}
</script>

<style module scoped>
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
	display: flex;
	justify-content: flex-end;

	margin-left: 8px;
	border: 1px solid var(--pt-light-grey);
	border-radius: var(--pt-border-radius);
}

.btnRemove {
	background-color: aqua;
	width: 34px;
	height: 34px;
}

.selected {
	border: 2px solid var(--pt-blue);
}
</style>
