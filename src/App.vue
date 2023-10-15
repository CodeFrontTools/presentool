<script setup lang="ts">
import SlidesContainer from '@/components/SlidesContainer/SlidesContainer.vue'
import Workspace from '@/components/TheWorkspace.vue'
</script>

<template>
	<div :class="$style.container">
		<SlidesContainer />
		<Workspace />
	</div>
</template>

<style module>
.container {
	display: flex;
}
</style>
