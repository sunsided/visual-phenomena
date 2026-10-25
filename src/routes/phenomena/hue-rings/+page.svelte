<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ControlGroup,
		HueField,
		Notice,
		Playback,
		PhenomenonLayout,
		Segmented,
		Slider,
		Toggle
	} from '#lib';
	import type { Axis, HueLayout, HueShape } from '#lib/components/organisms/HueField.svelte';

	const playback = new Playback();

	let shape = $state<HueShape>('ring');
	let layout = $state<HueLayout>('pair');
	let axis = $state<Axis>('horizontal');
	let frequency = $state(1.5);
	let offset = $state(60);
	let edge = $state(2);
	let reverse = $state(false);
	let arrows = $state(true);
</script>

<PhenomenonLayout
	title="Hue rings"
	lede="Two rings, each cycling through the colour wheel, each pinned to its spot. They drift towards wherever their arrow points anyway, and the trick sits in two pixels along their edges."
>
	{#snippet stage()}
		<HueField
			{shape}
			{layout}
			{axis}
			{frequency}
			{offset}
			{edge}
			{reverse}
			{arrows}
			paused={!playback.playing}
		/>
	{/snippet}

	{#snippet controls()}
		<Notice>Contains rapidly changing colours. Pause if it is uncomfortable.</Notice>

		<ControlGroup title="Playback">
			<Toggle label="Animate" bind:checked={playback.playing} />
			<Slider
				label="Colour cycle"
				bind:value={frequency}
				min={0.25}
				max={4}
				step={0.25}
				unit=" Hz"
			/>
		</ControlGroup>

		<ControlGroup title="Stimulus">
			<Slider label="Edge hue offset" bind:value={offset} min={0} max={180} step={5} unit="°" />
			<Slider label="Edge width" bind:value={edge} min={0.5} max={8} step={0.5} unit=" px" />
			<Toggle label="Reverse direction" bind:checked={reverse} />
			<Toggle label="Arrows" bind:checked={arrows} />
		</ControlGroup>

		<ControlGroup title="Layout">
			<Segmented
				label="Shape"
				bind:value={shape}
				options={[
					{ value: 'ring', label: 'Rings' },
					{ value: 'square', label: 'Squares' },
					{ value: 'cube', label: 'Cubes' }
				]}
			/>
			<Segmented
				label="Arrangement"
				bind:value={layout}
				options={[
					{ value: 'pair', label: 'Pair' },
					{ value: 'grid', label: 'Grid' }
				]}
			/>
			<Segmented
				label="Direction"
				bind:value={axis}
				options={[
					{ value: 'horizontal', label: '← →' },
					{ value: 'vertical', label: '↑ ↓' },
					{ value: 'diagonal', label: '↖ ↘' },
					{ value: 'antidiagonal', label: '↙ ↗' }
				]}
			/>
		</ControlGroup>
	{/snippet}

	{#snippet explanation()}
		<h2>What's going on</h2>
		<p>
			This one is rebuilt from a GIF that made the rounds on Reddit in 2021 as "The circles are not
			moving". Taking its 50 frames apart pixel by pixel: the grey background and the arrows never
			change, and the hue at any point of a ring advances by about 100° per 100 ms frame. Along the
			inner and outer edge of each ring runs a strip two pixels wide whose hue is about 60° ahead of
			the ring on edges facing away from the arrow, and about 60° behind on edges facing towards it.
		</p>
		<p>
			That is the same rule as in the <a href={resolve('/phenomena/moving-arrows')}>moving arrows</a
			>, only in colour: two neighbouring regions running through the same cycle with a phase offset
			look, to an early motion detector, like something travelling from the leading region to the
			lagging one. On the back edge the strip leads and the ring lags, so motion points into the
			ring; on the front edge the ring leads and the strip lags, so motion points out of it. Both
			say "forward", and the ring goes nowhere.
		</p>
		<p>Things to try:</p>
		<ul>
			<li>
				<strong>Edge hue offset</strong> at 0°: the colours keep spinning, the rings stay put.
			</li>
			<li>
				<strong>Reverse direction</strong> swaps which edges run ahead and which lag behind, and the arrows
				turn around with them.
			</li>
			<li>
				<strong>Squares and cubes</strong> cycle through the hue circle as a whole instead of as a wheel.
				The edge rule is the same, and the cubes are my guess at a similar video with boxes that I couldn't
				take apart.
			</li>
			<li><strong>Edge width</strong> above a few pixels: the strips turn into visible rims.</li>
		</ul>
		<p class="sources">
			Sources: the original GIF on
			<a
				href="https://www.reddit.com/r/interestingasfuck/comments/n33izi/the_circles_are_not_moving/"
				>r/interestingasfuck</a
			>
			(creator unknown); Flynn &amp; Shapiro (2018),
			<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8825246/">The Perpetual Diamond</a>,
			<em>i-Perception</em> 9(6), which notes the effect works with luminance or colour.
		</p>
	{/snippet}
</PhenomenonLayout>
