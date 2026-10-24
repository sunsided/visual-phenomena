<!--
	@component
	Peripheral drift illusion in the style of Kitaoka's "Rotating Snakes".
	Rings of elements repeat an asymmetric luminance sequence (black → dark →
	white → light, black and white narrow). The image is completely static;
	perceived drift runs from black to dark and from white to light, and is
	strongest in peripheral vision while the eyes move.
-->
<script lang="ts" module>
	export type SnakePalette = 'grey' | 'colour';
	export type Sequence = 'four-step' | 'two-step';

	const PALETTES: Record<SnakePalette, string[]> = {
		grey: ['#000000', '#555555', '#ffffff', '#b4b4b4'],
		colour: ['#000000', '#2a4bd7', '#ffffff', '#f2d600']
	};
</script>

<script lang="ts">
	interface Props {
		rows?: number;
		cols?: number;
		rings?: number;
		/** Element length along the ring relative to the ring width. */
		elongation?: number;
		palette?: SnakePalette;
		/** two-step (black/white only) is the control: no drift. */
		sequence?: Sequence;
		/** Black and white as narrow edges, dark and light as wide fills (Kitaoka's layout). */
		narrowEdges?: boolean;
		/** Mirror every other disk so neighbours turn in opposite directions. */
		mirror?: boolean;
	}

	let {
		rows = 2,
		cols = 3,
		rings = 5,
		elongation = 1.6,
		palette = 'colour',
		sequence = 'four-step',
		narrowEdges = true,
		mirror = true
	}: Props = $props();

	const R = 100;

	function point(r: number, a: number): string {
		return `${(r * Math.cos(a)).toFixed(3)} ${(r * Math.sin(a)).toFixed(3)}`;
	}

	function sector(r0: number, r1: number, a0: number, a1: number): string {
		return `M ${point(r1, a0)} A ${r1} ${r1} 0 0 1 ${point(r1, a1)} L ${point(r0, a1)} A ${r0} ${r0} 0 0 0 ${point(r0, a0)} Z`;
	}

	// Steps of one element in angular order: black, dark, white, light. Drift
	// is perceived from black towards dark and from white towards light.
	const steps = $derived.by(() => {
		const [black, dark, white, light] = PALETTES[palette];
		if (sequence === 'two-step') {
			return [
				{ fill: black, share: 0.5 },
				{ fill: white, share: 0.5 }
			];
		}
		const edge = narrowEdges ? 0.12 : 0.25;
		const fill = 0.5 - edge;
		return [
			{ fill: black, share: edge },
			{ fill: dark, share: fill },
			{ fill: white, share: edge },
			{ fill: light, share: fill }
		];
	});

	// One disk, centred on the origin. All rings run the same way: opposing
	// rings would largely cancel each other's motion signals. Every ring gets
	// as many whole elements as fit, so elements keep their shape.
	const disk = $derived.by(() => {
		const paths: { d: string; fill: string }[] = [];
		const width = R / (rings + 0.6);
		for (let ring = 0; ring < rings; ring++) {
			const r0 = width * (ring + 0.6);
			const r1 = r0 + width;
			const count = Math.max(4, Math.round((Math.PI * (r0 + r1)) / (width * elongation)));
			const span = (2 * Math.PI) / count;
			const offset = ring % 2 === 0 ? 0 : span / 2;
			for (let e = 0; e < count; e++) {
				let a = e * span + offset;
				for (const step of steps) {
					const a1 = a + step.share * span;
					paths.push({ d: sector(r0, r1, a, a1), fill: step.fill });
					a = a1;
				}
			}
		}
		return paths;
	});
</script>

<svg
	class="snakes"
	viewBox="0 0 {cols * 2 * R} {rows * 2 * R}"
	role="img"
	aria-label="Disks of repeating elements"
>
	{#each { length: rows }, row (row)}
		{#each { length: cols }, col (col)}
			<g
				transform="translate({(col * 2 + 1) * R} {(row * 2 + 1) * R}) scale({mirror &&
				(row + col) % 2 === 1
					? -1
					: 1} 1)"
			>
				<circle r={R} fill="#808080" />
				{#each disk as segment, i (i)}
					<path d={segment.d} fill={segment.fill} />
				{/each}
			</g>
		{/each}
	{/each}
</svg>

<style>
	.snakes {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
