<!--
	@component
	Titled panel that stacks form controls.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<section class="control-group" aria-label={title}>
	<h2>{title}</h2>
	<div class="controls">
		{@render children()}
	</div>
</section>

<style>
	.control-group {
		padding: var(--space-4);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	h2 {
		margin: 0 0 var(--space-3);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	.controls {
		display: grid;
		gap: var(--space-4);
	}
</style>
