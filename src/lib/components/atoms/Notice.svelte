<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<p class="notice" role="note">
	{@render children()}
</p>

<style>
	.notice {
		margin: 0;
		padding: var(--space-3) var(--space-4);
		border-left: 3px solid var(--color-accent);
		background: var(--color-surface);
		border-radius: 0 var(--radius) var(--radius) 0;
		font-size: 0.875rem;
		color: var(--color-muted);
	}
</style>
