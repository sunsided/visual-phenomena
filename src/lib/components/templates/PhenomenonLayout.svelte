<!--
	@component
	Page frame for a single phenomenon: heading, stage, controls, explanation.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		lede: string;
		stage: Snippet;
		controls?: Snippet;
		explanation?: Snippet;
	}

	let { title, lede, stage, controls, explanation }: Props = $props();
</script>

<svelte:head>
	<title>{title} · Visual Phenomena</title>
	<meta name="description" content={lede} />
</svelte:head>

<article class="phenomenon">
	<header>
		<a class="back" href={resolve('/')}>← All phenomena</a>
		<h1>{title}</h1>
		<p class="lede">{lede}</p>
	</header>

	<div class={['workbench', { 'has-controls': controls }]}>
		<div class="stage">
			{@render stage()}
		</div>
		{#if controls}
			<aside class="controls">
				{@render controls()}
			</aside>
		{/if}
	</div>

	{#if explanation}
		<section class="explanation">
			{@render explanation()}
		</section>
	{/if}
</article>

<style>
	.phenomenon {
		max-width: var(--content-width);
		margin: 0 auto;
		padding: var(--space-8) var(--space-4) var(--space-12);
	}

	.back {
		font-size: 0.875rem;
		text-decoration: none;
	}

	h1 {
		margin: var(--space-2) 0;
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		line-height: 1.15;
	}

	.lede {
		max-width: 60ch;
		margin: 0 0 var(--space-6);
		color: var(--color-muted);
		font-size: 1.125rem;
	}

	.workbench {
		display: grid;
		gap: var(--space-4);
	}

	@media (min-width: 56rem) {
		.workbench.has-controls {
			grid-template-columns: 1fr 18rem;
			align-items: start;
		}
	}

	.stage {
		display: grid;
		place-items: center;
		min-height: 20rem;
		padding: clamp(var(--space-4), 5vw, var(--space-12));
		background: var(--color-stage);
		border-radius: var(--radius);
	}

	.controls {
		display: grid;
		gap: var(--space-4);
	}

	.explanation {
		max-width: 65ch;
		margin-top: var(--space-8);
	}

	.explanation :global(h2) {
		font-size: 1.25rem;
	}

	.explanation :global(.sources) {
		font-size: 0.875rem;
		color: var(--color-muted);
	}
</style>
