<!--
	@component
	Lilac chaser (Jeremy Hinton). Twelve blurred discs on a circle; one is
	missing at a time and the gap travels around. Fixating the centre cross,
	the gap turns into a green disc and the lilac discs fade away (Troxler
	fading plus negative afterimages).
-->
<script lang="ts">
	import { PhaseClock } from '../../clock.svelte';

	interface Props {
		count?: number;
		/** How long each gap stays, in milliseconds. */
		stepMs?: number;
		/** Gaussian blur of the discs, in viewBox units. */
		blur?: number;
		colour?: string;
		cross?: boolean;
		paused?: boolean;
	}

	let {
		count = 12,
		stepMs = 100,
		blur = 6,
		colour = '#e6a0e6',
		cross = true,
		paused = false
	}: Props = $props();

	const clock = new PhaseClock(
		() => 1000 / (count * stepMs),
		() => paused
	);

	const missing = $derived(Math.floor((clock.phase / (2 * Math.PI)) * count) % count);
	const uid = $props.id();
	const R = 140;
</script>

<svg class="lilac" viewBox="-200 -200 400 400" role="img" aria-label="Ring of blurred discs">
	<defs>
		<filter id="{uid}-blur" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation={blur} />
		</filter>
	</defs>
	<rect x="-200" y="-200" width="400" height="400" fill="#bfbfbf" />
	<g fill={colour} filter="url(#{uid}-blur)">
		{#each { length: count }, i (i)}
			{@const a = (i / count) * 2 * Math.PI - Math.PI / 2}
			<circle cx={R * Math.cos(a)} cy={R * Math.sin(a)} r="22" opacity={i === missing ? 0 : 1} />
		{/each}
	</g>
	{#if cross}
		<path d="M -8 0 H 8 M 0 -8 V 8" stroke="#000" stroke-width="2" />
	{/if}
</svg>

<style>
	.lilac {
		display: block;
		width: 100%;
		max-width: 32rem;
		height: auto;
		margin: 0 auto;
	}
</style>
