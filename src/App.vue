<script setup lang="ts">
import BaseHeader from '@/components/header/BaseHeader.vue'
import SlidesContainer from '@/components/SlidesContainer/SlidesContainer.vue'
import Workspace from '@/components/TheWorkspace.vue'
</script>

<template>
	<BaseHeader />
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
