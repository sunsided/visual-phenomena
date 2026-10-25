<script lang="ts">
	import { ControlGroup, FloatingSphere, PhenomenonLayout, Segmented, Slider, Toggle } from '#lib';
	import type { SphereDrift, SpherePalette } from '#lib/components/organisms/FloatingSphere.svelte';

	let stroke = $state(0.09);
	let sphereDrift = $state<SphereDrift>('original');
	let palette = $state<SpherePalette>('original');
	let sphere = $state(true);
	let tube = $state(true);
</script>

<PhenomenonLayout
	title="Floating sphere"
	lede="A honeycomb and a ball in front of it, drawn once and never touched again. The ball still drifts, the wall behind it drifts the other way, and neither of them has a single animated pixel."
>
	{#snippet stage()}
		<FloatingSphere {stroke} {sphereDrift} {palette} {sphere} {tube} />
	{/snippet}

	{#snippet controls()}
		<ControlGroup title="Pattern">
			<Slider label="Stroke width" bind:value={stroke} min={0} max={0.2} step={0.01} />
			<Segmented
				label="Sphere drift"
				bind:value={sphereDrift}
				options={[
					{ value: 'original', label: 'Original' },
					{ value: 'opposite', label: 'Opposite' },
					{ value: 'same', label: 'Same' },
					{ value: 'none', label: 'None' }
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
			<Toggle label="Sphere" bind:checked={sphere} />
			<Toggle label="Tube" bind:checked={tube} />
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
			Each hexagon has a black stroke on one side and a white stroke on the other, so reading across
			a tile you get gold, black, purple, white, gold again: light, black, dark, white, light.
			That's the same asymmetric luminance sequence as in the
			<a href="/phenomena/rotating-snakes">rotating snakes</a>, and the drift runs the same way,
			from black to dark and from white to light. The wall drifts to the right, the strokes on the
			ball point up and to the right, and the two slide against each other. Behind the ball the wall
			bends back into a tube whose cells squash into slivers towards its rims; that gives the
			picture its depth, and the ball reads as an object hanging in front of it.
		</p>
		<p>
			My version is a rebuild rather than a copy: the tube is a plain hourglass with a vertical
			axis, and the ball is wrapped honeycomb with a bit of shading.
		</p>
		<p>Things to try:</p>
		<ul>
			<li>
				<strong>Sphere drift: None</strong> drops the strokes on the ball; the ball sits still.
			</li>
			<li>
				<strong>Opposite</strong> and <strong>Same</strong> point the ball's strokes straight against
				or along the wall's; compare how much floating is left in each.
			</li>
			<li><strong>Tube</strong> off flattens the wall behind the ball.</li>
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
