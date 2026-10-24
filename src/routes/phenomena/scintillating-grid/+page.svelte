<script lang="ts">
	import { ControlGroup, PhenomenonLayout, ScintillatingGrid, Slider } from '#lib';

	let disc = $state(0.26);
	let bar = $state(0.16);
	let barLevel = $state(0.5);
</script>

<PhenomenonLayout
	title="Scintillating grid"
	lede="White discs on grey crossings, black background. Every disc you aren't looking at directly flashes dark for a moment; the one you are looking at stays stubbornly white."
>
	{#snippet stage()}
		<ScintillatingGrid {disc} {bar} {barLevel} />
	{/snippet}

	{#snippet controls()}
		<ControlGroup title="Grid">
			<Slider label="Disc size" bind:value={disc} min={0} max={0.5} step={0.02} unit=" cell" />
			<Slider label="Bar width" bind:value={bar} min={0.04} max={0.4} step={0.02} unit=" cell" />
			<Slider label="Bar lightness" bind:value={barLevel} min={0} max={1} step={0.05} />
		</ControlGroup>
	{/snippet}

	{#snippet explanation()}
		<h2>What's going on</h2>
		<p>
			Without the discs this is the Hermann grid (Ludimar Hermann, 1870), where faint grey smudges
			show up at the crossings. Elke Lingelbach noticed that white discs on the crossings turn the
			smudges into dark dots that flash, and Schrauf, Lingelbach and Wist described the
			scintillating grid in 1997.
		</p>
		<p>
			The textbook explanation for the Hermann grid is lateral inhibition: a retinal ganglion cell
			centred on a crossing has more bright surround than one centred on a bar, so it fires less,
			and the crossing looks darker. It's a neat story, and it turns out to be incomplete: Geier and
			colleagues (2008) bent the bars into gentle waves and the illusion went away, which receptive
			fields of that size shouldn't care about. The scintillation is even less settled; it depends
			on eye movements and is strongest right after a glance.
		</p>
		<p>Things to try:</p>
		<ul>
			<li><strong>Disc size</strong> at 0: the Hermann grid, smudges and all.</li>
			<li>
				<strong>Bar lightness:</strong> change the contrast between bars and background and watch the
				flashing strengthen or fade.
			</li>
			<li>Fix your eyes on one disc and hold still for a few seconds, then glance away.</li>
		</ul>
		<p class="sources">
			Sources: Schrauf, Lingelbach &amp; Wist (1997), The scintillating grid illusion,
			<em>Vision Research</em> 37; Geier, Bernáth, Hudák &amp; Séra (2008), Straightness as the main
			factor of the Hermann grid illusion, <em>Perception</em> 37; Michael Bach,
			<a href="https://michaelbach.de/ot/lum-scGrid/">Scintillating Grid</a>.
		</p>
	{/snippet}
</PhenomenonLayout>
