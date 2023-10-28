<script setup lang="ts">
import BaseButton from '@/components/buttons/BaseButton.vue'
import type { BaseButtonProps } from '@/components/buttons/types'

const props = defineProps<Omit<BaseButtonProps, 'variant'>>()
</script>

<template>
	<BaseButton
		:class="$style.button"
		variant="light"
		:action="props.action"
		:icon-name="props.iconName"
		:disabled="props.disabled"
		:highlighted="props.highlighted"
	/>
</template>

<style module>
.button {
	padding: 3px;
}
</style>
