<!--
	@component
	Stepping feet (Anstis, 2001). A dark blue and a light yellow bar glide at
	exactly the same constant speed over black and white stripes, yet appear
	to take turns stepping forward. Without the stripes, they glide together.
-->
<script lang="ts">
	interface Props {
		/** Seconds for one pass across the field. */
		period?: number;
		/** Stripe width in viewBox units. */
		stripe?: number;
		stripes?: boolean;
		paused?: boolean;
	}

	let { period = 16, stripe = 10, stripes = true, paused = false }: Props = $props();

	const W = 600;
	const H = 200;
	const BAR = 60;
	const uid = $props.id();
</script>

<svg class="feet" viewBox="0 0 {W} {H}" role="img" aria-label="Two bars moving across stripes">
	<defs>
		<pattern id="{uid}-stripes" width={stripe * 2} height={H} patternUnits="userSpaceOnUse">
			<rect width={stripe} height={H} fill="#000" />
			<rect x={stripe} width={stripe} height={H} fill="#fff" />
		</pattern>
	</defs>
	<rect width={W} height={H} fill={stripes ? `url(#${uid}-stripes)` : '#808080'} />
	<g class={['bars', { paused }]} style:animation-duration="{period}s" style:--travel="{W - BAR}px">
		<rect y="50" width={BAR} height="24" fill="#1b2a8f" />
		<rect y="126" width={BAR} height="24" fill="#ffe64d" />
	</g>
</svg>

<style>
	.feet {
		display: block;
		width: 100%;
		height: auto;
	}

	.bars {
		animation: walk linear infinite alternate;
	}

	.bars.paused {
		animation-play-state: paused;
	}

	@keyframes walk {
		to {
			transform: translateX(var(--travel));
		}
	}
</style>
