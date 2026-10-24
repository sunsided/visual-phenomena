<script lang="ts">
	import {
		ControlGroup,
		FourStrokeField,
		Notice,
		Playback,
		PhenomenonLayout,
		Segmented,
		Slider,
		Toggle
	} from '#lib';

	const playback = new Playback();

	let step = $state(3);
	let frameMs = $state(100);
	let contrast = $state(0.9);
	let invert = $state(true);
	let guides = $state(false);
	let density = $state<'few' | 'many'>('many');

	const grid = $derived(density === 'many' ? { rows: 4, cols: 10 } : { rows: 2, cols: 4 });
</script>

<PhenomenonLayout
	title="Four-stroke motion"
	lede="Each arrow hops a few pixels forward and then straight back, over and over. You see them march forward anyway: every hop back comes with light and dark swapped."
>
	{#snippet stage()}
		<FourStrokeField
			{...grid}
			{step}
			{frameMs}
			{contrast}
			{invert}
			{guides}
			paused={!playback.playing}
		/>
	{/snippet}

	{#snippet controls()}
		<Notice>Contains flickering. Pause if it is uncomfortable.</Notice>

		<ControlGroup title="Playback">
			<Toggle label="Animate" bind:checked={playback.playing} />
			<Toggle label="Show fixed guides" bind:checked={guides} />
			<Slider label="Frame duration" bind:value={frameMs} min={17} max={400} step={1} unit=" ms" />
		</ControlGroup>

		<ControlGroup title="Stimulus">
			<Toggle label="Reverse contrast on return" bind:checked={invert} />
			<Slider label="Hop distance" bind:value={step} min={0.5} max={20} step={0.5} unit=" px" />
			<Slider label="Contrast" bind:value={contrast} min={0.1} max={1} step={0.05} />
			<Segmented
				label="Density"
				bind:value={density}
				options={[
					{ value: 'few', label: 'Few, large' },
					{ value: 'many', label: 'Many, small' }
				]}
			/>
		</ControlGroup>
	{/snippet}

	{#snippet explanation()}
		<h2>What's going on</h2>
		<p>The whole animation is four frames on repeat:</p>
		<ol>
			<li>light arrow at position <em>x</em>,</li>
			<li>light arrow at <em>x + d</em> (a small hop forward),</li>
			<li>dark arrow back at <em>x</em>, and</li>
			<li>dark arrow at <em>x + d</em> (another hop forward).</li>
		</ol>
		<p>
			Hops 1→2 and 3→4 are plain forward motion. The return hops, 2→3 and 4→1, go backwards, but
			they flip light and dark at the same time, and early motion detectors care about the sign of
			contrast: a small shift combined with a contrast reversal is reported as motion in the
			opposite direction, i.e. reversed phi (Anstis, 1970). So the backward hop registers as forward
			as well, and the motion signal never turns around. The part of your visual system that tracks
			where things are can tell perfectly well that the arrows go nowhere, which is why this feels
			slightly unsettling rather than smooth.
		</p>
		<p>
			Unlike the moving arrows next door, these aren't strictly static; they really do jitter by a
			few pixels. Kitaoka's four-stroke GIFs use 80 to 100 ms per frame, which is where the default
			comes from.
		</p>
		<p>Things to try:</p>
		<ul>
			<li>
				<strong>Turn off contrast reversal:</strong> the arrows jitter in place, which is what they physically
				do.
			</li>
			<li>
				<strong>Increase the hop distance</strong> beyond roughly 10 px: reversed phi only works for small
				shifts, the backward hops become visible, and the arrows start to judder.
			</li>
			<li>
				<strong>Slow the frames down</strong> to 300 ms or more: you can follow every hop and flip, and
				the forward drift often survives anyway.
			</li>
		</ul>
		<p class="sources">
			Sources: Anstis &amp; Rogers (1986),
			<a href="https://europepmc.org/article/MED/3588223"
				>Illusory continuous motion from oscillating positive-negative patterns</a
			>, <em>Perception</em> 15; Michael Bach,
			<a href="https://michaelbach.de/ot/mot-reversePhi/">Reverse Phi</a>; Akiyoshi Kitaoka,
			<a href="https://www.psy.ritsumei.ac.jp/akitaoka/reversephi.html">reversed phi demos</a>.
		</p>
	{/snippet}
</PhenomenonLayout>
