<!--
	@component
	Floating sphere in the style of Yurii Perepadia's 2016 illustration: a
	static honeycomb whose hexagons carry a white stroke on the three edges
	facing the drift and a black stroke on the three facing away (Kitaoka's
	peripheral drift recipe). An hourglass pillar stands behind the ball. By
	default only the ball drifts against everything else, which is what makes
	it float; nothing moves.
-->
<script lang="ts" module>
	/** Drift relative to the wall, which always drifts right. */
	export type SphereDrift = 'against' | 'with' | 'none';
	export type PillarDrift = 'with' | 'against';
	export type SpherePalette = 'original' | 'grey';

	interface Colours {
		lattice: string;
		body: string;
		pillarBody: string;
		sphereLattice: string;
		sphereBody: string;
	}

	const PALETTES: Record<SpherePalette, Colours> = {
		original: {
			lattice: '#a8922c',
			body: '#4f0f80',
			pillarBody: '#7a1690',
			sphereLattice: '#d9ad1c',
			sphereBody: '#8f1846'
		},
		grey: {
			lattice: '#b4b4b4',
			body: '#555555',
			pillarBody: '#5e5e5e',
			sphereLattice: '#c4c4c4',
			sphereBody: '#4a4a4a'
		}
	};

	type Point = [number, number];

	const RIGHT: Point = [1, 0];
	const LEFT: Point = [-1, 0];
</script>

<script lang="ts">
	interface Props {
		/** Stroke width as a fraction of the cell radius. */
		stroke?: number;
		sphereDrift?: SphereDrift;
		pillarDrift?: PillarDrift;
		palette?: SpherePalette;
		sphere?: boolean;
		pillar?: boolean;
	}

	let {
		stroke = 0.1,
		sphereDrift = 'against',
		pillarDrift = 'with',
		palette = 'original',
		sphere = true,
		pillar = true
	}: Props = $props();

	const W = 1000;
	const H = 560;
	const HEX = 50; // centre-to-vertex radius of a wall cell
	const PILLAR_HEX = 44;
	const SPHERE_HEX = 58; // the ball's texture is a little coarser, as in the original
	const BODY = 0.78; // hexagon inside the gold lattice, relative to the cell
	const SPHERE = { cx: 290, cy: 285, r: 230 };
	// The pillar stands behind the ball: its left rim only shows above and below it.
	const PILLAR = { cx: 530, waist: 200, flare: 80 };
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
	 * One cell: a coloured hexagon with a uniform stroke band around it, white
	 * on the edges whose outward normal points along the drift, black on the
	 * ones pointing against it. Bands are built in texture space and then
	 * mapped, so they squash along with the cells on the ball and the pillar.
	 */
	function tile(centre: Point, size: number, dir: Point, map: (p: Point) => Point) {
		const r = BODY * size;
		const width = stroke * size;
		const inner = hexagon(centre[0], centre[1], r);
		const outer = hexagon(centre[0], centre[1], r + width / Math.cos(Math.PI / 6));
		const bands = { white: '', black: '' };
		if (width > 0) {
			for (let i = 0; i < 6; i++) {
				// Edge i runs from vertex i to i + 1; its outward normal is at -60° + 60°·i.
				const n = ((-60 + 60 * i) * Math.PI) / 180;
				const dot = Math.cos(n) * dir[0] + Math.sin(n) * dir[1];
				if (Math.abs(dot) < 1e-6) continue;
				const j = (i + 1) % 6;
				bands[dot > 0 ? 'white' : 'black'] += toPath(
					[inner[i], inner[j], outer[j], outer[i]].map(map)
				);
			}
		}
		return { ...bands, body: toPath(inner.map(map)) };
	}

	const wall = $derived(
		lattice(W / 2, H / 2, HEX).map(([x, y]) => tile([x + W / 2, y + H / 2], HEX, RIGHT, (p) => p))
	);

	// The pillar has a vertical axis. Texture x is arc length around it, so cells
	// squash into slivers towards the rims, as on a cylinder seen from the front.
	function pillarHalfWidth(y: number): number {
		const t = (y - H / 2) / (H / 2);
		return PILLAR.waist + PILLAR.flare * t * t;
	}

	function onPillar([u, y]: Point): Point {
		const a = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, u / PILLAR.waist));
		return [PILLAR.cx + pillarHalfWidth(y) * Math.sin(a), y];
	}

	function pillarEdge(side: -1 | 1): Point[] {
		return Array.from({ length: 41 }, (_, i): Point => {
			const y = -20 + (i * (H + 40)) / 40;
			return [PILLAR.cx + side * pillarHalfWidth(y), y];
		});
	}

	const pillarOutline = toPath([...pillarEdge(-1), ...pillarEdge(1).reverse()]);
	// Everything right of the pillar is the far wall, in shadow.
	const farWall = toPath([...pillarEdge(1), [W + 20, H + 20], [W + 20, -20]]);

	const pillarTiles = $derived.by(() => {
		const reach = (PILLAR.waist * Math.PI) / 2;
		return lattice(reach, H / 2, PILLAR_HEX)
			.filter(([u]) => Math.abs(u) < reach + PILLAR_HEX)
			.map(([u, y]) =>
				tile([u, y + H / 2], PILLAR_HEX, pillarDrift === 'with' ? RIGHT : LEFT, onPillar)
			);
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
		const dir: Point = sphereDrift === 'none' ? [0, 0] : sphereDrift === 'against' ? LEFT : RIGHT;
		return lattice(reach, reach, SPHERE_HEX)
			.filter(([x, y]) => Math.hypot(x, y) < reach + SPHERE_HEX)
			.map((c) => tile(c, SPHERE_HEX, dir, onSphere));
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
	aria-label="Honeycomb wall with an hourglass pillar and a sphere in front"
>
	<defs>
		<clipPath id="{uid}-sphere"><circle cx={SPHERE.cx} cy={SPHERE.cy} r={SPHERE.r} /></clipPath>
		<clipPath id="{uid}-pillar"><path d={pillarOutline} /></clipPath>
		<linearGradient
			id="{uid}-pillar-shade"
			gradientUnits="userSpaceOnUse"
			x1={PILLAR.cx - PILLAR.waist - PILLAR.flare}
			x2={PILLAR.cx + PILLAR.waist + PILLAR.flare}
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

	{#if pillar}
		<path d={farWall} fill="#000" opacity="0.3" />
		<g clip-path="url(#{uid}-pillar)">
			<rect width={W} height={H} fill={colours.lattice} />
			{@render tiles(pillarTiles, colours.pillarBody)}
			<rect width={W} height={H} fill="url(#{uid}-pillar-shade)" />
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
