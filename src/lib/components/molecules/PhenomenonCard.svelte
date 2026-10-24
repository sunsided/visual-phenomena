<!--
	@component
	Link card for the phenomenon index, with a live preview.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		title: string;
		summary: string;
		preview: Snippet;
	}

	let { href, title, summary, preview }: Props = $props();
</script>

<a class="card" {href}>
	<div class="preview" aria-hidden="true">
		{@render preview()}
	</div>
	<div class="text">
		<h2>{title}</h2>
		<p>{summary}</p>
	</div>
</a>

<style>
	.card {
		display: grid;
		min-width: 0;
		overflow: hidden;
		color: inherit;
		text-decoration: none;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		transition: border-color 150ms;
	}

	.card:hover {
		border-color: var(--color-accent);
	}

	.preview {
		aspect-ratio: 16 / 9;
		display: grid;
		place-items: center;
		padding: var(--space-4);
		overflow: hidden;
		background: var(--color-stage);
	}

	/* Square demos would otherwise overflow the 16:9 frame. */
	.preview :global(svg) {
		max-width: 100%;
		max-height: 100%;
		width: auto;
	}

	.preview > :global(*) {
		min-height: 0;
		max-height: 100%;
	}

	.text {
		padding: var(--space-4);
	}

	h2 {
		margin: 0 0 var(--space-1);
		font-size: 1.125rem;
	}

	p {
		margin: 0;
		color: var(--color-muted);
		font-size: 0.925rem;
	}
</style>
