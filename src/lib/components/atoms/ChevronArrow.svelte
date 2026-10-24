<!--
	@component
	A geometrically fixed chevron with a body and two thin edge strips: the
	front (tip) edges and the back (notch) edges. Colors come from the inherited
	`--vp-body` / `--vp-front` / `--vp-back` custom properties, so a parent
	can modulate them in lockstep with the background it paints behind the
	arrow (see `ArrowField`). The arrow points right before `angle` is applied.
-->
<script lang="ts">
	interface Props {
		/** Width of each edge strip in CSS pixels; the effect needs it thin (1–4px). */
		edge?: number;
		/** Arm thickness, measured horizontally, in viewBox units (viewBox is 60 × 100). */
		thickness?: number;
		/** Rotation in degrees; 0 points right. */
		angle?: number;
		/** Draw fixed reference lines at tip and tail to show the shape is static. */
		guides?: boolean;
	}

	let { edge = 2, thickness = 22, angle = 0, guides = false }: Props = $props();

	const W = 60;
	const H = 100;
	const uid = $props.id();

	const outline = $derived(
		[
			[0, 0],
			[thickness, 0],
			[W, H / 2],
			[thickness, H],
			[0, H],
			[W - thickness, H / 2]
		]
			.map((p) => p.join(','))
			.join(' ')
	);
	const front = $derived(`M ${thickness} 0 L ${W} ${H / 2} L ${thickness} ${H}`);
	const back = $derived(`M 0 ${H} L ${W - thickness} ${H / 2} L 0 0`);
</script>

<svg class="chevron" viewBox="0 0 {W} {H}" style:rotate="{angle}deg" role="img" aria-label="Arrow">
	<defs>
		<clipPath id="{uid}-shape">
			<polygon points={outline} />
		</clipPath>
	</defs>

	<polygon class="body" points={outline} />

	<!-- Strokes are centred on the outline; clipping keeps only the inner half. -->
	<g
		clip-path="url(#{uid}-shape)"
		fill="none"
		stroke-width={edge * 2}
		stroke-linejoin="miter"
		stroke-miterlimit="10"
	>
		<path class="front" d={front} vector-effect="non-scaling-stroke" />
		<path class="back" d={back} vector-effect="non-scaling-stroke" />
	</g>

	{#if guides}
		<g class="guides">
			<line x1={W} x2={W} y1="0" y2={H} />
			<line x1="0" x2="0" y1="0" y2={H} />
		</g>
	{/if}
</svg>

<style>
	.chevron {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.body {
		fill: var(--vp-body, rgb(128 128 128));
	}

	.front {
		stroke: var(--vp-front, white);
	}

	.back {
		stroke: var(--vp-back, black);
	}

	.guides line {
		stroke: var(--color-accent);
		stroke-width: 1;
		stroke-dasharray: 4 3;
		vector-effect: non-scaling-stroke;
	}
</style>
