<script lang="ts">
	import { ControlGroup, PhenomenonLayout, RotatingSnakes, Segmented, Slider, Toggle } from '#lib';
	import type { Sequence, SnakePalette } from '#lib/components/organisms/RotatingSnakes.svelte';

	let rings = $state(5);
	let elongation = $state(1.6);
	let palette = $state<SnakePalette>('colour');
	let sequence = $state<Sequence>('four-step');
	let narrowEdges = $state(true);
	let mirror = $state(true);
</script>

<PhenomenonLayout
	title="Rotating snakes"
	lede="Nothing on this page is animated: no CSS animation, no JavaScript clock, only a few hundred static SVG paths. The disks turn anyway, mostly the ones you aren't looking at, and best while your eyes move."
>
	{#snippet stage()}
		<RotatingSnakes {rings} {elongation} {palette} {sequence} {narrowEdges} {mirror} />
	{/snippet}

	{#snippet controls()}
		<ControlGroup title="Pattern">
			<Segmented
				label="Sequence"
				bind:value={sequence}
				options={[
					{ value: 'four-step', label: 'Four-step' },
					{ value: 'two-step', label: 'Black & white' }
				]}
			/>
			<Segmented
				label="Palette"
				bind:value={palette}
				options={[
					{ value: 'grey', label: 'Grey' },
					{ value: 'colour', label: 'Blue & yellow' }
				]}
			/>
			{#if sequence === 'four-step'}
				<Toggle label="Narrow black & white edges" bind:checked={narrowEdges} />
			{/if}
			<Slider label="Rings" bind:value={rings} min={2} max={8} />
			<Slider label="Element length" bind:value={elongation} min={0.8} max={4} step={0.1} />
			<Toggle label="Mirror neighbouring disks" bind:checked={mirror} />
		</ControlGroup>
	{/snippet}

	{#snippet explanation()}
		<h2>What's going on</h2>
		<p>
			This is the peripheral drift illusion. Faubert and Herbert described it in 1999 with sawtooth
			luminance gradients, and Akiyoshi Kitaoka took it to its famous extreme with Rotating Snakes
			(2003). Each element here is a narrow black edge, a wide dark fill (blue, or dark grey), a
			narrow white edge, and a wide light fill (yellow, or light grey), repeated all the way around;
			the perceived drift runs from black to dark and from white to light (Kitaoka &amp; Ashida,
			2003). All rings of a disk share that direction, and neighbouring disks are mirrored, so they
			turn the other way.
		</p>
		<p>
			The trigger is your own eye movements: every saccade sweeps the pattern across the retina, and
			the motion detectors there report motion in both directions as it passes. With a symmetric
			pattern those reports cancel out. With the asymmetric luminance steps (and a little
			non-linearity in how the detectors are wired together) they don't quite, and the leftover is
			read as rotation (Bach &amp; Atala-Gérard, 2020). That also explains why the disks come to a
			halt when you fixate steadily, and why rings running in opposite directions would mostly
			cancel each other out.
		</p>
		<p>
			Somewhere along the way the picture also picked up a reputation as a "stress test", where the
			speed of the rotation supposedly says something about your state of mind. It doesn't; by
			Michael Bach's estimate, perhaps one in twenty people don't see it rotate at all.
		</p>
		<p>Things to try:</p>
		<ul>
			<li>
				<strong>Black &amp; white:</strong> the same disks and the same layout, minus the intermediate
				greys. No asymmetry, no drift.
			</li>
			<li>
				<strong>Narrow edges off:</strong> all four steps get the same width; compare how much of the
				rotation survives.
			</li>
			<li>
				<strong>Grey</strong> swaps blue and yellow for greys of similar lightness. The colour isn't required;
				the luminance order does the work.
			</li>
			<li>
				Read this text while the disks sit in the corner of your eye, or let your gaze jump around.
			</li>
		</ul>
		<p class="sources">
			Sources: Kitaoka &amp; Ashida (2003), Phenomenal characteristics of the peripheral drift
			illusion, <em>Vision</em> 15; Faubert &amp; Herbert (1999), The peripheral drift illusion,
			<em>Perception</em> 28; Bach &amp; Atala-Gérard (2020), The Rotating Snakes Illusion is a
			straightforward consequence of non-linearity in arrays of standard motion detectors,
			<em>i-Perception</em> 11(5); Michael Bach,
			<a href="https://michaelbach.de/ot/mot-snakes/">Rotating Snakes</a>.
		</p>
	{/snippet}
</PhenomenonLayout>
