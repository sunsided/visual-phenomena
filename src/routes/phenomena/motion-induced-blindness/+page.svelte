<script lang="ts">
	import {
		ControlGroup,
		MotionInducedBlindness,
		Playback,
		PhenomenonLayout,
		Slider,
		Toggle
	} from '#lib';

	const playback = new Playback();

	let period = $state(6);
	let dot = $state(6);
</script>

<PhenomenonLayout
	title="Motion-induced blindness"
	lede="Three yellow dots, always there, never changing. Look at the green dot in the middle while the blue pattern turns, and sooner or later one of them (or two, or all three) is gone."
>
	{#snippet stage()}
		<MotionInducedBlindness {period} {dot} paused={!playback.playing} />
	{/snippet}

	{#snippet controls()}
		<ControlGroup title="Playback">
			<Toggle label="Animate" bind:checked={playback.playing} />
			<Slider label="Rotation period" bind:value={period} min={1} max={20} step={0.5} unit=" s" />
		</ControlGroup>

		<ControlGroup title="Stimulus">
			<Slider label="Dot size" bind:value={dot} min={2} max={14} step={1} />
		</ControlGroup>
	{/snippet}

	{#snippet explanation()}
		<h2>What's going on</h2>
		<p>
			Yoram Bonneh, Alexander Cooperman and Dov Sagi published this in <em>Nature</em> in 2001. The yellow
			dots are bright, high-contrast and physically constant, and the rotating pattern never touches them;
			they disappear for seconds at a time anyway, and come back on their own, sometimes in pairs.
		</p>
		<p>
			What exactly happens is still open. The disappearances behave a lot like perceptual rivalry,
			where the brain alternates between two interpretations of the same input, and the common idea
			is that the strong moving pattern competes with the static dots for awareness and now and then
			wins. It's a different beast than Troxler fading: the dots are sharp, bright and close to
			where you're looking, which is exactly the kind of stimulus that normally doesn't fade at all.
		</p>
		<p>Things to try:</p>
		<ul>
			<li>
				<strong>Rotation period:</strong> change the speed and see how it affects how often the dots go.
			</li>
			<li>
				<strong>Pause:</strong> without the motion, the dots mostly stay put in your awareness, too.
			</li>
			<li><strong>Dot size:</strong> compare how long small and large dots survive.</li>
		</ul>
		<p class="sources">
			Sources: Bonneh, Cooperman &amp; Sagi (2001), Motion-induced blindness in normal observers,
			<em>Nature</em> 411; Michael Bach,
			<a href="https://michaelbach.de/ot/mot-mib/">Motion-induced Blindness</a>.
		</p>
	{/snippet}
</PhenomenonLayout>
