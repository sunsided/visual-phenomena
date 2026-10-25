<!--
	@component
	Static shapes whose colours cycle through the hue circle, with thin edge
	strips running a fixed hue offset ahead (back edges) or behind (front
	edges). It's the Perpetual Diamond rule (motion runs from the phase-leading
	to the lagging region) done in colour, as in the viral "the circles are not
	moving" GIF: rings drift towards the arrow inside them while staying put.

	Rendered on a canvas: conic gradients and exact device-pixel strip widths
	aren't available in SVG.
-->
<script lang="ts" module>
	export type HueShape = 'ring' | 'square' | 'cube';
	export type HueLayout = 'pair' | 'grid';
	export type Axis = 'horizontal' | 'vertical' | 'diagonal' | 'antidiagonal';

	/** Angle of the first direction on each axis; the other is opposite. 0 = right, 90 = down. */
	const AXIS_ANGLE: Record<Axis, number> = {
		horizontal: 0,
		vertical: 90,
		diagonal: 45,
		antidiagonal: -45
	};
</script>

<script lang="ts">
	import { PhaseClock } from '../../clock.svelte';
	import { edgeRuns, shapes, type Point } from '../../shapes';

	interface Props {
		shape?: HueShape;
		layout?: HueLayout;
		axis?: Axis;
		/** Hue revolutions per second at any fixed point. */
		frequency?: number;
		/** Hue offset of the edge strips in degrees; the GIF uses roughly 60. */
		offset?: number;
		/** Edge strip width in CSS pixels. */
		edge?: number;
		/** Turn every shape around: arrows and edge offsets flip together. */
		reverse?: boolean;
		arrows?: boolean;
		paused?: boolean;
	}

	let {
		shape = 'ring',
		layout = 'pair',
		axis = 'horizontal',
		frequency = 1.5,
		offset = 60,
		edge = 2,
		reverse = false,
		arrows = true,
		paused = false
	}: Props = $props();

	const BACKGROUND = 'rgb(128 128 128)';
	const ARROW = 'rgb(96 96 97)';

	const clock = new PhaseClock(
		() => frequency,
		() => paused
	);

	let canvas: HTMLCanvasElement | undefined = $state();
	let width = $state(0);

	const grid = $derived(layout === 'pair' ? { cols: 2, rows: 1 } : { cols: 4, rows: 2 });

	function directionFor(index: number, row: number): number {
		const base = layout === 'pair' ? index : index + row;
		return AXIS_ANGLE[axis] + (base % 2 === 0 ? 0 : 180) + (reverse ? 180 : 0);
	}

	function hsl(hue: number): string {
		return `hsl(${((hue % 360) + 360) % 360} 85% 48%)`;
	}

	/** Fill style for a hue field shifted by `shift` degrees. */
	function paint(
		ctx: CanvasRenderingContext2D,
		cx: number,
		cy: number,
		hue: number,
		shift: number
	) {
		if (shape !== 'ring') return hsl(hue + shift);
		// Hue grows with the angle; rotating the start angle shifts it in time.
		const g = ctx.createConicGradient((-(hue + shift) * Math.PI) / 180, cx, cy);
		for (let i = 0; i <= 12; i++) g.addColorStop(i / 12, hsl(i * 30));
		return g;
	}

	function tracePolyline(
		ctx: CanvasRenderingContext2D,
		pts: Point[],
		cx: number,
		cy: number,
		k: number
	) {
		ctx.moveTo(cx + pts[0][0] * k, cy + pts[0][1] * k);
		for (const [x, y] of pts.slice(1)) ctx.lineTo(cx + x * k, cy + y * k);
	}

	function drawArrow(
		ctx: CanvasRenderingContext2D,
		cx: number,
		cy: number,
		size: number,
		deg: number
	) {
		ctx.save();
		ctx.translate(cx, cy);
		ctx.rotate((deg * Math.PI) / 180);
		ctx.fillStyle = ARROW;
		ctx.beginPath();
		ctx.moveTo(-size, -size * 0.18);
		ctx.lineTo(size * 0.2, -size * 0.18);
		ctx.lineTo(size * 0.2, -size * 0.5);
		ctx.lineTo(size, 0);
		ctx.lineTo(size * 0.2, size * 0.5);
		ctx.lineTo(size * 0.2, size * 0.18);
		ctx.lineTo(-size, size * 0.18);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

	$effect(() => {
		if (!canvas || width === 0) return;
		const dpr = window.devicePixelRatio || 1;
		const { cols, rows } = grid;
		const cell = width / cols;
		const [w, h] = [Math.round(width * dpr), Math.round(cell * rows * dpr)];
		if (canvas.width !== w || canvas.height !== h) [canvas.width, canvas.height] = [w, h];
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const hue = (clock.phase * 180) / Math.PI;
		const strip = edge * dpr;
		const size = cell * dpr;

		ctx.fillStyle = BACKGROUND;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const cx = (col + 0.5) * size;
				const cy = (row + 0.5) * size;
				const dir = directionFor(col, row);

				// Outline(s) at unit scale; k maps them into device pixels.
				const k = (size * 0.4) / 50;
				const outer = shape === 'ring' ? shapes.circle.outline : shapes[shape].outline;
				const inner = shape === 'ring' ? outer.map(([x, y]): Point => [x * 0.64, y * 0.64]) : null;

				ctx.save();
				ctx.beginPath();
				tracePolyline(ctx, [...outer, outer[0]], cx, cy, k);
				if (inner) tracePolyline(ctx, [...inner, inner[0]], cx, cy, k);
				ctx.clip('evenodd');

				// Body.
				ctx.fillStyle = paint(ctx, cx, cy, hue, 0);
				ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
				if (shape === 'cube') {
					for (const [i, face] of (shapes.cube.faces ?? []).entries()) {
						ctx.fillStyle = ['rgb(255 255 255 / 0.18)', 'rgb(0 0 0 / 0)', 'rgb(0 0 0 / 0.18)'][i];
						ctx.beginPath();
						tracePolyline(ctx, [...face.points, face.points[0]], cx, cy, k);
						ctx.fill();
					}
				}

				// Edge strips: strokes centred on the outline, clipped to its inside.
				ctx.lineWidth = strip * 2;
				ctx.lineJoin = 'miter';
				const runs = edgeRuns(outer, dir);
				// The hole's edges face the opposite way of the disc's.
				const holeRuns = inner
					? edgeRuns(inner, dir).map((r) => ({
							...r,
							role: r.role === 'front' ? 'back' : r.role === 'back' ? 'front' : r.role
						}))
					: [];
				for (const role of ['front', 'back'] as const) {
					ctx.strokeStyle = paint(ctx, cx, cy, hue, role === 'back' ? offset : -offset);
					ctx.beginPath();
					for (const run of [...runs, ...holeRuns]) {
						if (run.role === role) tracePolyline(ctx, run.points, cx, cy, k);
					}
					ctx.stroke();
				}
				ctx.restore();

				if (arrows) drawArrow(ctx, cx, cy, size * (shape === 'ring' ? 0.13 : 0.16), dir);
			}
		}
	});
</script>

<div class="hue-field" bind:clientWidth={width}>
	<canvas bind:this={canvas}
		>Colour-cycling shapes with arrows pointing the way they seem to drift.</canvas
	>
</div>

<style>
	.hue-field {
		width: 100%;
	}

	canvas {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
