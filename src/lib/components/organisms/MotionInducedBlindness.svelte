<!--
	@component
	Motion-induced blindness (Bonneh, Cooperman & Sagi, 2001). Three static
	yellow dots sit on top of a rotating blue pattern; while fixating the
	centre, the dots disappear and reappear, alone or together.
-->
<script lang="ts">
	interface Props {
		/** Seconds per full rotation of the mask. */
		period?: number;
		/** Dot radius in viewBox units. */
		dot?: number;
		colour?: string;
		paused?: boolean;
	}

	let { period = 6, dot = 6, colour = '#ffeb00', paused = false }: Props = $props();

	const STEP = 40;
	const crosses = Array.from({ length: 9 }, (_, i) => (i - 4) * STEP).flatMap((x) =>
		Array.from({ length: 9 }, (_, j) => ({ x, y: (j - 4) * STEP }))
	);
	const dots = [
		{ x: 0, y: -110 },
		{ x: -95, y: 55 },
		{ x: 95, y: 55 }
	];
</script>

<svg
	class="mib"
	viewBox="-180 -180 360 360"
	role="img"
	aria-label="Rotating blue crosses with three yellow dots"
>
	<rect x="-180" y="-180" width="360" height="360" fill="#000" />
	<g class={['mask', { paused }]} style:animation-duration="{period}s">
		{#each crosses as c, i (i)}
			<path
				d="M {c.x - 8} {c.y} H {c.x + 8} M {c.x} {c.y - 8} V {c.y + 8}"
				stroke="#2f4fff"
				stroke-width="3"
			/>
		{/each}
	</g>
	{#each dots as d, i (i)}
		<circle cx={d.x} cy={d.y} r={dot} fill={colour} />
	{/each}
	<circle class={['fixation', { paused }]} r="4" fill="#9cff9c" />
</svg>

<style>
	.mib {
		display: block;
		width: 100%;
		max-width: 32rem;
		height: auto;
		margin: 0 auto;
	}

	.mask {
		animation: spin linear infinite;
	}

	.fixation {
		animation: blink 0.8s steps(1) infinite;
	}

	/* After the animation shorthands, which would reset play-state. */
	.paused {
		animation-play-state: paused;
	}

	@keyframes spin {
		to {
			rotate: 360deg;
		}
	}

	@keyframes blink {
		50% {
			opacity: 0.2;
		}
	}
</style>
