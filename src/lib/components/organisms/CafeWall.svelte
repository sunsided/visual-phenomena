<!--
	@component
	Café wall illusion (Gregory & Heard, 1979). Rows of black and white tiles,
	shifted against each other and separated by thin grey mortar. The mortar
	lines are perfectly parallel but appear to tilt into wedges. With black or
	white mortar the effect disappears.
-->
<script lang="ts">
	interface Props {
		rows?: number;
		cols?: number;
		/** Row shift as a fraction of a tile, applied in a 0, 1, 2, 1 zig-zag. */
		shift?: number;
		/** Mortar thickness as a fraction of the tile size. */
		mortar?: number;
		/** Mortar lightness, 0 (black) – 1 (white). */
		mortarLevel?: number;
		guides?: boolean;
	}

	let {
		rows = 9,
		cols = 12,
		shift = 0.25,
		mortar = 0.06,
		mortarLevel = 0.5,
		guides = false
	}: Props = $props();

	const S = 40;
	const ZIGZAG = [0, 1, 2, 1];

	const gap = $derived(S * mortar);
	const height = $derived(rows * S + (rows + 1) * gap);
	const mortarFill = $derived(
		`rgb(${Array(3)
			.fill(Math.round(mortarLevel * 255))
			.join(' ')})`
	);

	function rowY(row: number): number {
		return gap + row * (S + gap);
	}
</script>

<svg class="cafe-wall" viewBox="0 0 {cols * S} {height}" role="img" aria-label="Café wall pattern">
	<defs>
		<clipPath id="cafe-wall-clip"><rect width={cols * S} {height} /></clipPath>
	</defs>
	<g clip-path="url(#cafe-wall-clip)">
		<rect width={cols * S} {height} fill={mortarFill} />
		{#each { length: rows }, row (row)}
			{@const x0 = (ZIGZAG[row % 4] * shift - 2) * S}
			{#each { length: cols + 4 }, col (col)}
				{#if col % 2 === 0}
					<rect x={x0 + col * S} y={rowY(row)} width={S} height={S} fill="#000" />
				{:else}
					<rect x={x0 + col * S} y={rowY(row)} width={S} height={S} fill="#fff" />
				{/if}
			{/each}
		{/each}
		{#if guides}
			{#each { length: rows + 1 }, i (i)}
				<line
					class="guide"
					x1="0"
					x2={cols * S}
					y1={i * (S + gap) + gap / 2}
					y2={i * (S + gap) + gap / 2}
				/>
			{/each}
		{/if}
	</g>
</svg>

<style>
	.cafe-wall {
		display: block;
		width: 100%;
		height: auto;
	}

	.guide {
		stroke: var(--color-accent);
		stroke-width: 1.5;
		vector-effect: non-scaling-stroke;
	}
</style>
