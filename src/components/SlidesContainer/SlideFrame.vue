<template>
	<div :class="[$style.containerSlide]">
		<div :class="[$style.wrapper]">
			<div :class="[$style.slideNumber]">{{ slideNumber }}</div>
			<button :class="[$style.btnRemove]" @click="remove">
				<BaseIcon name="remove" />
			</button>
		</div>

		<div :class="[$style.miniature, selected ? $style.selected : '']"></div>
	</div>
</template>

<script setup lang="ts">
import BaseIcon from '../BaseIcon.vue'

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
.btnRemove {
	width: 11px;
	height: 11px;
	opacity: 0;
}

.containerSlide {
	display: flex;
	justify-content: end;

	&:hover {
		.btnRemove {
			transition: 0.5s;
			opacity: 1;
		}
	}
}

.wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
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

.selected {
	border: 2px solid var(--pt-blue);
}
</style>
