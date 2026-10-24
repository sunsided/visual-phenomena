<!--
	@component
	Four-stroke apparent motion (Anstis & Rogers, 1986). Arrows cycle through
	four frames: at x, at x + d, at x inverted, at x + d inverted. The forward
	hop reads as forward motion; the backward hop, because it comes with a
	contrast reversal, *also* reads as forward motion (reversed phi). The
	arrows never get anywhere, but appear to travel continuously.
-->
<script lang="ts">
	import ChevronArrow from '../atoms/ChevronArrow.svelte';
	import { PhaseClock } from '../../clock.svelte';
	import { grey } from '../../luminance';

	interface Props {
		rows?: number;
		cols?: number;
		/** Hop distance in CSS pixels; reversed phi needs it small. */
		step?: number;
		/** Duration of each of the four frames, in milliseconds. */
		frameMs?: number;
		/** Contrast of the arrow against the grey background, 0–1. */
		contrast?: number;
		/** Without reversal the arrows just jitter back and forth. */
		invert?: boolean;
		paused?: boolean;
		guides?: boolean;
	}

	let {
		rows = 3,
		cols = 8,
		step = 3,
		frameMs = 100,
		contrast = 0.9,
		invert = true,
		paused = false,
		guides = false
	}: Props = $props();

	const clock = new PhaseClock(
		() => 1000 / (4 * frameMs),
		() => paused
	);

	const frame = $derived(Math.floor((clock.phase / (2 * Math.PI)) * 4) % 4);
	const shifted = $derived(frame % 2 === 1);
	const negative = $derived(invert && frame >= 2);
	const body = $derived(grey(negative ? -contrast : contrast));
</script>

<div class="field" style:--cols={cols} style:--vp-body={body}>
	{#each { length: rows * cols }, i (i)}
		<div class="cell">
			<div class="arrow" style:translate="{shifted ? step : 0}px 0">
				<ChevronArrow edge={0} />
			</div>
			{#if guides}
				<!-- Outside the hopping element, so the markers stay put. -->
				<div class="guides" aria-hidden="true"></div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.field {
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		gap: clamp(0.5rem, 1.5vw, 1.25rem);
		width: 100%;
		padding: clamp(0.75rem, 3vw, 2rem);
		background: rgb(128 128 128);
		--vp-front: var(--vp-body);
		--vp-back: var(--vp-body);
	}

	.cell {
		position: relative;
	}

	.guides {
		position: absolute;
		inset: 0;
		border-inline: 1px dashed var(--color-accent);
		pointer-events: none;
	}
</style>
