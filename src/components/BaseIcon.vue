<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const props = defineProps<{
	name: string
	width?: number
	height?: number
}>()

const icon = defineAsyncComponent(() => import(`../assets/svg/${props.name}.svg`))
</script>

<template>
	<component :is="icon" style="width: width; height: height" />
</template>
