<script lang="ts">
	import { ControlGroup, Playback, PhenomenonLayout, Slider, SteppingFeet, Toggle } from '#lib';

	const playback = new Playback();

	let period = $state(16);
	let stripe = $state(10);
	let stripes = $state(true);
</script>

<PhenomenonLayout
	title="Stepping feet"
	lede="A dark blue bar and a light yellow bar glide across the stripes at exactly the same, constant speed. They look like two feet taking turns."
>
	{#snippet stage()}
		<SteppingFeet {period} {stripe} {stripes} paused={!playback.playing} />
	{/snippet}

	{#snippet controls()}
		<ControlGroup title="Playback">
			<Toggle label="Animate" bind:checked={playback.playing} />
			<Slider label="Time per pass" bind:value={period} min={2} max={20} step={0.5} unit=" s" />
		</ControlGroup>

		<ControlGroup title="Background">
			<Toggle label="Stripes" bind:checked={stripes} />
			<Slider label="Stripe width" bind:value={stripe} min={4} max={30} step={1} />
		</ControlGroup>
	{/snippet}

	{#snippet explanation()}
		<h2>What's going on</h2>
		<p>
			Stuart Anstis described this in 2001, and the point it makes is that perceived speed depends
			on contrast: an edge with high contrast against its background looks faster than one with low
			contrast. The blue bar is dark, so it stands out against the white stripes and almost vanishes
			against the black ones; the yellow bar is the other way around. As the bars move, their ends
			alternate between high- and low-contrast stripes, so whenever the blue bar seems to speed up,
			the yellow one seems to slow down, and vice versa: footsteps.
		</p>
		<p>
			With the default stripe width each bar is exactly three stripe pairs long, so both of its ends
			always sit on the same kind of stripe. Most other widths break that symmetry, and the bars
			start to inch along like caterpillars instead (Anstis had a name for that too: inchworms).
		</p>
		<p>Things to try:</p>
		<ul>
			<li><strong>Turn off the stripes:</strong> same bars, same speed, no stepping.</li>
			<li><strong>Stripe width:</strong> wider stripes make for longer, slower steps.</li>
			<li>Look at the gap between the bars rather than at either of them.</li>
		</ul>
		<p class="sources">
			Sources: Anstis (2001), Footsteps and inchworms: illusions show that contrast affects apparent
			speed, <em>Perception</em> 30; Michael Bach,
			<a href="https://michaelbach.de/ot/mot-feetLin/">Stepping Feet</a>.
		</p>
	{/snippet}
</PhenomenonLayout>
