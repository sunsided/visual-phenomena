<!--
	@component
	Floating sphere in the style of Yurii Perepadia's 2016 illustration: a
	static honeycomb whose hexagons carry a black stroke on one side and a white
	stroke on the other (Kitaoka's peripheral drift recipe). Behind the ball the
	wall bends back into an hourglass-shaped tube; the ball's own honeycomb
	drifts in a different direction. Nothing moves, and the ball floats anyway.
-->
<script lang="ts" module>
	export type SphereDrift = 'original' | 'opposite' | 'same' | 'none';
	export type SpherePalette = 'original' | 'grey';

	interface Colours {
		lattice: string;
		body: string;
		tubeBody: string;
		sphereLattice: string;
		sphereBody: string;
	}

	const PALETTES: Record<SpherePalette, Colours> = {
		original: {
			lattice: '#a8922c',
			body: '#4f0f80',
			tubeBody: '#7a1690',
			sphereLattice: '#d9ad1c',
			sphereBody: '#8f1846'
		},
		grey: {
			lattice: '#b4b4b4',
			body: '#555555',
			tubeBody: '#5e5e5e',
			sphereLattice: '#c4c4c4',
			sphereBody: '#4a4a4a'
		}
	};

	/** Drift direction of the ball's strokes; the original's point up and to the right. */
	const SPHERE_DIRECTION: Record<Exclude<SphereDrift, 'none'>, [number, number]> = {
		original: [Math.SQRT1_2, -Math.SQRT1_2],
		opposite: [-1, 0],
		same: [1, 0]
	};
</script>

<script lang="ts">
	import type { Point } from '../../shapes';

	interface Props {
		/** Crescent width as a fraction of the hexagon radius. */
		stroke?: number;
		sphereDrift?: SphereDrift;
		palette?: SpherePalette;
		sphere?: boolean;
		tube?: boolean;
	}

	let {
		stroke = 0.09,
		sphereDrift = 'original',
		palette = 'original',
		sphere = true,
		tube = true
	}: Props = $props();

	const W = 1000;
	const H = 560;
	const HEX = 50; // centre-to-vertex radius of a wall cell
	const TUBE_HEX = 42;
	const SPHERE_HEX = 58; // the ball's texture is a little coarser, as in the original
	const BODY = 0.78; // hexagon inside the gold lattice, relative to the cell
	const SPHERE = { cx: 290, cy: 280, r: 230 };
	const TUBE = { cx: 650, waist: 140, flare: 80 };
	const uid = $props.id();

	const colours = $derived(PALETTES[palette]);

	function hexagon(cx: number, cy: number, r: number): Point[] {
		return Array.from({ length: 6 }, (_, i) => {
			const a = ((60 * i - 90) * Math.PI) / 180;
			return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
		});
	}

	function toPath(points: Point[]): string {
		return 'M' + points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L') + 'Z';
	}

	/** Pointy-top honeycomb centres covering a rectangle around the origin. */
	function lattice(halfW: number, halfH: number, size: number): Point[] {
		const dx = Math.sqrt(3) * size;
		const dy = 1.5 * size;
		const centres: Point[] = [];
		for (let row = -Math.ceil(halfH / dy) - 1; row <= Math.ceil(halfH / dy) + 1; row++) {
			const shift = (Math.abs(row) % 2) * (dx / 2);
			for (let col = -Math.ceil(halfW / dx) - 1; col <= Math.ceil(halfW / dx) + 1; col++) {
				centres.push([col * dx + shift, row * dy]);
			}
		}
		return centres;
	}

	/**
	 * One tile as three paths: black copy shifted against the drift, white copy
	 * shifted along it, coloured body on top. What's left visible is a black
	 * crescent at the back and a white one at the front.
	 */
	function tile(centre: Point, size: number, dir: Point, shift: number, map: (p: Point) => Point) {
		const [cx, cy] = centre;
		const [off, r] = [shift * size, BODY * size];
		return {
			black: toPath(hexagon(cx - dir[0] * off, cy - dir[1] * off, r).map(map)),
			white: toPath(hexagon(cx + dir[0] * off, cy + dir[1] * off, r).map(map)),
			body: toPath(hexagon(cx, cy, r).map(map))
		};
	}

	const wall = $derived(
		lattice(W / 2, H / 2, HEX).map(([x, y]) =>
			tile([x + W / 2, y + H / 2], HEX, [1, 0], stroke, (p) => p)
		)
	);

	// The tube has a vertical axis. Texture x is arc length around it, so cells
	// squash into slivers towards the rims, as on a cylinder seen from the front.
	function tubeHalfWidth(y: number): number {
		const t = (y - H / 2) / (H / 2);
		return TUBE.waist + TUBE.flare * t * t;
	}

	function onTube([u, y]: Point): Point {
		const a = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, u / TUBE.waist));
		return [TUBE.cx + tubeHalfWidth(y) * Math.sin(a), y];
	}

	function tubeEdge(side: -1 | 1): Point[] {
		return Array.from({ length: 41 }, (_, i): Point => {
			const y = -20 + (i * (H + 40)) / 40;
			return [TUBE.cx + side * tubeHalfWidth(y), y];
		});
	}

	const tubeOutline = toPath([...tubeEdge(-1), ...tubeEdge(1).reverse()]);
	// Everything right of the tube is the far wall, in shadow.
	const farWall = toPath([...tubeEdge(1), [W + 20, H + 20], [W + 20, -20]]);

	const tubeTiles = $derived.by(() => {
		const reach = (TUBE.waist * Math.PI) / 2;
		return lattice(reach, H / 2, TUBE_HEX)
			.filter(([u]) => Math.abs(u) < reach + TUBE_HEX)
			.map(([u, y]) => tile([u, y + H / 2], TUBE_HEX, [1, 0], stroke, onTube));
	});

	// The ball's honeycomb is wrapped onto the sphere: a texture point at arc
	// length ρ from the centre lands at R·sin(ρ/R).
	function onSphere([x, y]: Point): Point {
		const rho = Math.hypot(x, y);
		if (rho === 0) return [SPHERE.cx, SPHERE.cy];
		const k = (SPHERE.r * Math.sin(Math.min(rho / SPHERE.r, Math.PI / 2))) / rho;
		return [SPHERE.cx + x * k, SPHERE.cy + y * k];
	}

	const sphereTiles = $derived.by(() => {
		const reach = (SPHERE.r * Math.PI) / 2;
		const dir: Point = sphereDrift === 'none' ? [1, 0] : SPHERE_DIRECTION[sphereDrift];
		const shift = sphereDrift === 'none' ? 0 : stroke;
		return lattice(reach, reach, SPHERE_HEX)
			.filter(([x, y]) => Math.hypot(x, y) < reach + SPHERE_HEX)
			.map((c) => tile(c, SPHERE_HEX, dir, shift, onSphere));
	});
</script>

{#snippet tiles(list: { black: string; white: string; body: string }[], body: string)}
	{#each list as t, i (i)}
		<path d={t.black} fill="#111" />
		<path d={t.white} fill="#f4f4f4" />
		<path d={t.body} fill={body} />
	{/each}
{/snippet}

<svg
	class="floating-sphere"
	viewBox="0 0 {W} {H}"
	role="img"
	aria-label="Honeycomb wall with a tube and a sphere in front"
>
	<defs>
		<clipPath id="{uid}-sphere"><circle cx={SPHERE.cx} cy={SPHERE.cy} r={SPHERE.r} /></clipPath>
		<clipPath id="{uid}-tube"><path d={tubeOutline} /></clipPath>
		<linearGradient
			id="{uid}-tube-shade"
			gradientUnits="userSpaceOnUse"
			x1={TUBE.cx - TUBE.waist - TUBE.flare}
			x2={TUBE.cx + TUBE.waist + TUBE.flare}
		>
			<stop offset="0" stop-color="#000" stop-opacity="0.55" />
			<stop offset="0.3" stop-color="#000" stop-opacity="0" />
			<stop offset="0.7" stop-color="#000" stop-opacity="0" />
			<stop offset="1" stop-color="#000" stop-opacity="0.55" />
		</linearGradient>
		<radialGradient id="{uid}-shade" cx="0.38" cy="0.32" r="0.75">
			<stop offset="0" stop-color="#fff" stop-opacity="0.1" />
			<stop offset="0.55" stop-color="#fff" stop-opacity="0" />
			<stop offset="1" stop-color="#000" stop-opacity="0.35" />
		</radialGradient>
	</defs>

	<rect width={W} height={H} fill={colours.lattice} />
	{@render tiles(wall, colours.body)}

	{#if tube}
		<path d={farWall} fill="#000" opacity="0.3" />
		<g clip-path="url(#{uid}-tube)">
			<rect width={W} height={H} fill={colours.lattice} />
			{@render tiles(tubeTiles, colours.tubeBody)}
			<rect width={W} height={H} fill="url(#{uid}-tube-shade)" />
		</g>
	{/if}

	{#if sphere}
		<g clip-path="url(#{uid}-sphere)">
			<circle cx={SPHERE.cx} cy={SPHERE.cy} r={SPHERE.r} fill={colours.sphereLattice} />
			{@render tiles(sphereTiles, colours.sphereBody)}
			<circle cx={SPHERE.cx} cy={SPHERE.cy} r={SPHERE.r} fill="url(#{uid}-shade)" />
		</g>
	{/if}
</svg>

<style>
	.floating-sphere {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
