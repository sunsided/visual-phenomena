<script lang="ts">
	import { resolve } from '$app/paths';
	import { ControlGroup, FloatingSphere, PhenomenonLayout, Segmented, Slider, Toggle } from '#lib';
	import type {
		PillarDrift,
		SphereDrift,
		SpherePalette
	} from '#lib/components/organisms/FloatingSphere.svelte';

	let stroke = $state(0.1);
	let sphereDrift = $state<SphereDrift>('against');
	let pillarDrift = $state<PillarDrift>('with');
	let palette = $state<SpherePalette>('original');
	let sphere = $state(true);
	let pillar = $state(true);
	let ballCell = $state(38);
</script>

<PhenomenonLayout
	title="Floating sphere"
	lede="A honeycomb wall, a pillar, and a ball in front of it, drawn once and never touched again. The ball still drifts against everything behind it, and not a single pixel is animated."
>
	{#snippet stage()}
		<FloatingSphere {stroke} {sphereDrift} {pillarDrift} {palette} {sphere} {pillar} {ballCell} />
	{/snippet}

	{#snippet controls()}
		<ControlGroup title="Pattern">
			<Slider label="Stroke width" bind:value={stroke} min={0} max={0.2} step={0.01} />
			<Slider label="Ball cell size" bind:value={ballCell} min={20} max={70} step={2} />
			<Segmented
				label="Ball drift"
				bind:value={sphereDrift}
				options={[
					{ value: 'against', label: 'Against wall' },
					{ value: 'with', label: 'With wall' },
					{ value: 'none', label: 'None' }
				]}
			/>
			<Segmented
				label="Pillar drift"
				bind:value={pillarDrift}
				options={[
					{ value: 'with', label: 'With wall' },
					{ value: 'against', label: 'Against wall' }
				]}
			/>
			<Segmented
				label="Palette"
				bind:value={palette}
				options={[
					{ value: 'original', label: 'Purple & gold' },
					{ value: 'grey', label: 'Grey' }
				]}
			/>
			<Toggle label="Ball" bind:checked={sphere} />
			<Toggle label="Pillar" bind:checked={pillar} />
		</ControlGroup>
	{/snippet}

	{#snippet explanation()}
		<h2>What's going on</h2>
		<p>
			The original is by Yurii Perepadia, a designer from Oleksandriya in Ukraine, who drew it in
			Adobe Illustrator in September 2016. A couple of years later it went viral as a "stress test"
			attributed to a Japanese neurology professor who, as far as anyone can tell, doesn't exist
			(BBC Three tracked down the real author). Perepadia himself describes the trick as Akiyoshi
			Kitaoka's effect: "a white and black stroke on a coloured background".
		</p>
		<p>
			Each hexagon has a white stroke along the three edges on one side and a black stroke along the
			three on the other, so reading across a cell you get gold, black, purple, white, gold again:
			light, black, dark, white, light. That's the asymmetric luminance sequence from the
			<a href={resolve('/phenomena/rotating-snakes')}>rotating snakes</a>, and the drift runs from
			black to dark and from white to light, i.e. towards the white side.
		</p>
		<p>
			What floats is whatever drifts against everything around it. Here the wall and the pillar both
			drift to the right and the ball's strokes point to the left, so the ball is the odd one out
			and slides against its whole surround. Measuring the strokes on the BBC's (heavily compressed)
			copy of the original suggested a different layout, with the pillar drifting against wall and
			ball; on screen that makes the pillar swim and leaves the ball sitting still, which you can
			check with the controls.
		</p>
		<p>Things to try:</p>
		<ul>
			<li><strong>Ball drift: None</strong> drops the strokes on the ball; it settles down.</li>
			<li>
				<strong>With wall</strong> lets the ball drift along with everything else; no floating.
			</li>
			<li>
				<strong>Pillar drift: Against wall</strong> makes the pillar the odd one out instead, and now
				the pillar swims while the ball stays put.
			</li>
			<li><strong>Pillar</strong> off flattens the wall behind the ball.</li>
			<li>
				<strong>Ball cell size:</strong> large cells weaken the drift; the original's ball has roughly
				seven cells across.
			</li>
			<li><strong>Stroke width</strong> at 0: a nice honeycomb, and nothing more.</li>
			<li>
				Look at the right-hand side of the picture and let the ball sit in the corner of your eye.
			</li>
		</ul>
		<p class="sources">
			Sources: Ashitha Nagesh (2018),
			<a href="https://www.bbc.com/bbcthree/article/1309b623-ec96-4213-a54b-0f0699fbd1c8"
				>No, this optical illusion doesn't reveal anything about your stress levels</a
			>, BBC Three; Kitaoka &amp; Ashida (2003), Phenomenal characteristics of the peripheral drift
			illusion, <em>Vision</em> 15.
		</p>
	{/snippet}
</PhenomenonLayout>
