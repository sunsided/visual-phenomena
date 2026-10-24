<script lang="ts">
	import {
		ArrowField,
		ControlGroup,
		Notice,
		Playback,
		PhenomenonLayout,
		Segmented,
		Slider,
		Toggle
	} from '#lib';
	import type { Layout, Mode } from '#lib/components/organisms/ArrowField.svelte';

	const playback = new Playback();

	let mode = $state<Mode>('perpetual');
	let edge = $state(2);
	let frequency = $state(2);
	let contrast = $state(0.9);
	let offset = $state(90);
	let density = $state<'few' | 'many'>('many');
	let layout = $state<Layout>('uniform');
	let reverse = $state(false);
	let guides = $state(false);

	const grid = $derived(density === 'many' ? { rows: 4, cols: 10 } : { rows: 2, cols: 4 });
</script>

<PhenomenonLayout
	title="Moving arrows"
	lede="None of these arrows move, neither their outline nor their body. A hairline along each edge and the background behind it pulse in brightness, a quarter cycle apart, and that turns out to be all your motion detectors need."
>
	{#snippet stage()}
		<ArrowField
			{...grid}
			{mode}
			{edge}
			{frequency}
			{contrast}
			{offset}
			{layout}
			{reverse}
			{guides}
			paused={!playback.playing}
		/>
	{/snippet}

	{#snippet controls()}
		<Notice>Contains flickering at 2 Hz by default. Pause if it is uncomfortable.</Notice>

		<ControlGroup title="Playback">
			<Toggle label="Animate" bind:checked={playback.playing} />
			<Toggle label="Show fixed guides" bind:checked={guides} />
			<Slider label="Frequency" bind:value={frequency} min={0.5} max={6} step={0.25} unit=" Hz" />
		</ControlGroup>

		<ControlGroup title="Stimulus">
			<Segmented
				label="Variant"
				bind:value={mode}
				options={[
					{ value: 'perpetual', label: 'Perpetual' },
					{ value: 'oscillating', label: 'Back & forth' }
				]}
			/>
			<Slider label="Edge width" bind:value={edge} min={0.5} max={10} step={0.5} unit=" px" />
			<Slider label="Contrast" bind:value={contrast} min={0} max={1} step={0.05} />
			{#if mode === 'perpetual'}
				<Slider label="Edge phase lead" bind:value={offset} min={0} max={180} step={15} unit="°" />
			{/if}
			<Toggle label="Reverse direction" bind:checked={reverse} />
		</ControlGroup>

		<ControlGroup title="Layout">
			<Segmented
				label="Density"
				bind:value={density}
				options={[
					{ value: 'few', label: 'Few, large' },
					{ value: 'many', label: 'Many, small' }
				]}
			/>
			<Segmented
				label="Orientation"
				bind:value={layout}
				options={[
					{ value: 'uniform', label: 'Uniform' },
					{ value: 'alternating', label: 'Rows' },
					{ value: 'opposing', label: 'Facing' }
				]}
			/>
		</ControlGroup>
	{/snippet}

	{#snippet explanation()}
		<h2>What's going on</h2>
		<p>
			Each arrow has a mid-grey body that never changes and two hairline strips, one along the tip
			and one along the notch. The background and both strips pulse sinusoidally between dark and
			light; the tip strip runs a quarter cycle ahead of the background, the notch strip a quarter
			cycle behind. As far as an early motion detector is concerned, two neighbouring spots
			flickering 90° apart are a drifting wave sampled at two points (i.e. exactly the input a
			motion-energy unit is built to respond to). Every edge reports motion towards the tip, the
			reports agree, and the brain pins the motion on the arrow. Position signals meanwhile insist
			that nothing moved, which is where the odd moving-yet-going-nowhere feeling comes from.
		</p>
		<p>Things to try:</p>
		<ul>
			<li>
				<strong>Show fixed guides:</strong> the dashed markers at tip and tail stay where they are, and
				so do the arrows.
			</li>
			<li>
				<strong>Edge phase lead</strong> at 0° or 180°: the arrows flicker and go nowhere; 90° is the
				sweet spot.
			</li>
			<li>
				<strong>Edge width</strong> above roughly 6 px: the strips start to read as flickering surfaces
				and the motion fades (Rogers and colleagues put the limit at about 10 arcmin).
			</li>
			<li>
				<strong>Reverse direction</strong> swaps the phases of the two strips. Any single frame looks
				exactly like before, and the arrows turn around anyway.
			</li>
			<li>
				<strong>Back &amp; forth</strong> keeps the strips static (light tip, dark notch) and only pulses
				the background, which is Gregory and Heard's 1983 version: the arrows slide to and fro instead
				of travelling.
			</li>
			<li>
				Look slightly past the field; peripheral vision is far more gullible here than the fovea.
			</li>
		</ul>
		<p>
			The sinusoid is computed in sRGB code values rather than linear luminance, so physically it
			isn't quite one; close enough for the eye, not for a paper.
		</p>
		<p class="sources">
			Sources: Flynn &amp; Shapiro (2018),
			<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8825246/">The Perpetual Diamond</a>,
			<em>i-Perception</em> 9(6); Rogers, Anstis, Ashida &amp; Kitaoka (2019),
			<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6661801/"
				>Phenomenal phenomena and reversed phi</a
			>, <em>i-Perception</em>.
		</p>
	{/snippet}
</PhenomenonLayout>
