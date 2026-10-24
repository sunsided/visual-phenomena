<script lang="ts">
	import { ControlGroup, LilacChaser, Playback, PhenomenonLayout, Slider, Toggle } from '#lib';

	const playback = new Playback();

	let stepMs = $state(100);
	let blur = $state(6);
	let cross = $state(true);
</script>

<PhenomenonLayout
	title="Lilac chaser"
	lede="Twelve blurred lilac discs, one of them missing at a time, the gap running around the circle. Keep your eyes on the cross for about twenty seconds."
>
	{#snippet stage()}
		<LilacChaser {stepMs} {blur} {cross} paused={!playback.playing} />
	{/snippet}

	{#snippet controls()}
		<ControlGroup title="Playback">
			<Toggle label="Animate" bind:checked={playback.playing} />
			<Slider label="Gap duration" bind:value={stepMs} min={40} max={400} step={10} unit=" ms" />
		</ControlGroup>

		<ControlGroup title="Stimulus">
			<Slider label="Blur" bind:value={blur} min={0} max={15} step={0.5} />
			<Toggle label="Fixation cross" bind:checked={cross} />
		</ControlGroup>
	{/snippet}

	{#snippet explanation()}
		<h2>What's going on</h2>
		<p>
			Jeremy Hinton came up with this one around 2005, and it packs three effects into one picture.
			First, the travelling gap is plain apparent motion: a disc disappearing here and reappearing
			next door reads as one thing moving. Second, every gap leaves a negative afterimage of a lilac
			disc, which is green, so the moving gap becomes a moving green disc. Third, Troxler fading
			(Ignaz Troxler, 1804): blurry, unchanging things in your peripheral vision fade from view when
			you hold your eyes still, so after a while the lilac discs go and only the green one remains,
			circling on grey.
		</p>
		<p>
			The blur matters for that last part. Sharp edges keep feeding the visual system with change at
			every tiny eye movement, and changing input doesn't fade.
		</p>
		<p>Things to try:</p>
		<ul>
			<li>
				<strong>Blur</strong> at 0: the lilac discs hold out much longer before they fade, if they fade
				at all.
			</li>
			<li>
				<strong>Gap duration:</strong> around 100 ms works well; go much slower and the motion falls apart
				into separate blinks.
			</li>
			<li>Hide the cross and let your eyes wander: no fading, and much less green.</li>
		</ul>
		<p class="sources">
			Sources: Michael Bach,
			<a href="https://michaelbach.de/ot/col-lilacChaser/">Lilac Chaser</a>; Troxler (1804), Über
			das Verschwinden gegebener Gegenstände innerhalb unseres Gesichtskreises.
		</p>
	{/snippet}
</PhenomenonLayout>
