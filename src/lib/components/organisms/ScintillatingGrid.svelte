<!--
	@component
	Scintillating grid (Schrauf, Lingelbach & Wist, 1997) and, with the discs
	removed, the Hermann grid. Grey bars on black with white discs at the
	crossings: dark dots flash inside the discs you are not looking at.
-->
<script lang="ts">
	interface Props {
		rows?: number;
		cols?: number;
		/** Bar width as a fraction of the cell size. */
		bar?: number;
		/** Disc diameter as a fraction of the cell size; 0 gives the Hermann grid. */
		disc?: number;
		/** Bar lightness, 0–1. */
		barLevel?: number;
	}

	let { rows = 8, cols = 12, bar = 0.16, disc = 0.26, barLevel = 0.5 }: Props = $props();

	const C = 50;
	const barWidth = $derived(C * bar);
	const barFill = $derived(
		`rgb(${Array(3)
			.fill(Math.round(barLevel * 255))
			.join(' ')})`
	);
</script>

<svg
	class="grid"
	viewBox="0 0 {cols * C} {rows * C}"
	role="img"
	aria-label="Grid of grey bars with white discs at the crossings"
>
	<rect width={cols * C} height={rows * C} fill="#000" />
	<g fill={barFill}>
		{#each { length: rows - 1 }, r (r)}
			<rect x="0" y={(r + 1) * C - barWidth / 2} width={cols * C} height={barWidth} />
		{/each}
		{#each { length: cols - 1 }, c (c)}
			<rect x={(c + 1) * C - barWidth / 2} y="0" width={barWidth} height={rows * C} />
		{/each}
	</g>
	{#if disc > 0}
		<g fill="#fff">
			{#each { length: rows - 1 }, r (r)}
				{#each { length: cols - 1 }, c (c)}
					<circle cx={(c + 1) * C} cy={(r + 1) * C} r={(C * disc) / 2} />
				{/each}
			{/each}
		</g>
	{/if}
</svg>

<style>
	.grid {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
