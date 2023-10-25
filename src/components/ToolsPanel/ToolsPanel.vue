<script setup lang="ts">
import ToolsButton from '@/components/ToolsPanel/ToolsButton.vue'
import { History } from '@/main'
</script>

<template>
	<div :class="$style.toolsPanel">
		<ToolsButton icon-name="arrow-left" :action="() => History.undo()" />
		<ToolsButton icon-name="arrow-right" :action="() => History.redo()" />
	</div>
</template>

<style module>
.toolsPanel {
	display: flex;
	align-items: center;
	height: 32px;
	padding-left: 4px;
	background-color: var(--pt-lighter-grey);
	border-radius: var(--pt-border-radius);
}
</style>
