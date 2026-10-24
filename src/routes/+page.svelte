<script lang="ts">
	import { PhenomenonCard, phenomena } from '#lib';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Visual Phenomena</title>
	<meta
		name="description"
		content="Interactive demonstrations of visual illusions and perceptual phenomena."
	/>
</svelte:head>

<main>
	<header>
		<h1>Visual Phenomena</h1>
		<p>
			Visual illusions, rebuilt from the papers that describe them, with knobs. Most of them work
			better if you look slightly to the side.
		</p>
	</header>

	<ul class="grid">
		{#each phenomena as phenomenon (phenomenon.slug)}
			<li>
				<PhenomenonCard
					href={resolve(phenomenon.path)}
					title={phenomenon.title}
					summary={phenomenon.summary}
				>
					{#snippet preview()}
						<phenomenon.preview.component {...phenomenon.preview.props} />
					{/snippet}
				</PhenomenonCard>
			</li>
		{/each}
	</ul>
</main>

<style>
	main {
		max-width: var(--content-width);
		margin: 0 auto;
		padding: var(--space-12) var(--space-4);
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 6vw, 3.5rem);
		line-height: 1.1;
	}

	header p {
		max-width: 60ch;
		margin: var(--space-2) 0 var(--space-8);
		color: var(--color-muted);
		font-size: 1.125rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
		gap: var(--space-6);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.grid > li {
		min-width: 0;
	}
</style>
