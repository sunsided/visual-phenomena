<!--
	@component
	Grid of static chevrons on a background that pulses in brightness. The
	edge strips of each arrow pulse with a phase offset from that background,
	which motion detectors read as the arrows travelling toward their tips.

	- perpetual: front edges lead the background by `offset`, back edges lag it
	  (Flynn & Shapiro's Perpetual Diamond) → continuous motion.
	- oscillating: light front strip, dark back strip, both static; only the
	  background pulses (Gregory & Heard) → arrows appear to shift back and forth.
-->
<script lang="ts" module>
	export type Layout = 'uniform' | 'alternating' | 'opposing';
	export type Mode = 'perpetual' | 'oscillating';
</script>

<script lang="ts">
	import ChevronArrow from '../atoms/ChevronArrow.svelte';
	import { PhaseClock } from '../../clock.svelte';
	import { grey, modulated } from '../../luminance';

	interface Props {
		rows?: number;
		cols?: number;
		mode?: Mode;
		/** Edge strip width in CSS pixels. */
		edge?: number;
		/** Modulation frequency in Hz. */
		frequency?: number;
		/** Modulation depth, 0–1. */
		contrast?: number;
		/** Phase lead of front edges over the background, in degrees (90 = strongest). */
		offset?: number;
		/** uniform: all point right; alternating: rows flip; opposing: halves face each other. */
		layout?: Layout;
		/** Swap front/back phases: same still frame, opposite motion. */
		reverse?: boolean;
		paused?: boolean;
		guides?: boolean;
	}

	let {
		rows = 3,
		cols = 8,
		mode = 'perpetual',
		edge = 2,
		frequency = 2,
		contrast = 0.9,
		offset = 90,
		layout = 'uniform',
		reverse = false,
		paused = false,
		guides = false
	}: Props = $props();

	const clock = new PhaseClock(
		() => frequency,
		() => paused
	);

	const lead = $derived(((reverse ? -offset : offset) * Math.PI) / 180);
	const background = $derived(modulated(clock.phase, contrast));
	const front = $derived(
		mode === 'perpetual' ? modulated(clock.phase + lead, contrast) : grey(reverse ? -1 : 1)
	);
	const back = $derived(
		mode === 'perpetual' ? modulated(clock.phase - lead, contrast) : grey(reverse ? 1 : -1)
	);

	function angleFor(row: number, col: number): number {
		switch (layout) {
			case 'alternating':
				return row % 2 === 0 ? 0 : 180;
			case 'opposing':
				return col < cols / 2 ? 0 : 180;
			default:
				return 0;
		}
	}
</script>

<div
	class="field"
	style:--cols={cols}
	style:--vp-front={front}
	style:--vp-back={back}
	style:background
>
	{#each { length: rows }, row (row)}
		{#each { length: cols }, col (col)}
			<ChevronArrow {edge} {guides} angle={angleFor(row, col)} />
		{/each}
	{/each}
</div>

<style>
	.field {
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		gap: clamp(0.5rem, 1.5vw, 1.25rem);
		width: 100%;
		padding: clamp(0.75rem, 3vw, 2rem);
	}
</style>
