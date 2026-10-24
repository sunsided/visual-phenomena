<script lang="ts">
	import { CafeWall, ControlGroup, PhenomenonLayout, Slider, Toggle } from '#lib';

	let shift = $state(0.25);
	let mortar = $state(0.06);
	let mortarLevel = $state(0.5);
	let guides = $state(false);
</script>

<PhenomenonLayout
	title="Café wall"
	lede="The grey lines between these rows of tiles are perfectly parallel and perfectly horizontal (turn on the guides if you don't trust me). They look like wedges anyway."
>
	{#snippet stage()}
		<CafeWall {shift} {mortar} {mortarLevel} {guides} />
	{/snippet}

	{#snippet controls()}
		<ControlGroup title="Wall">
			<Toggle label="Show straight guides" bind:checked={guides} />
			<Slider label="Row shift" bind:value={shift} min={0} max={0.5} step={0.05} unit=" tile" />
			<Slider label="Mortar width" bind:value={mortar} min={0} max={0.3} step={0.01} unit=" tile" />
			<Slider label="Mortar lightness" bind:value={mortarLevel} min={0} max={1} step={0.05} />
		</ControlGroup>
	{/snippet}

	{#snippet explanation()}
		<h2>What's going on</h2>
		<p>
			Richard Gregory and Priscilla Heard described this one in 1979, after Steve Simpson from
			Gregory's lab noticed it in the tiling of a café at the bottom of St Michael's Hill in
			Bristol. The tiles alternate black and white, every row is shifted against its neighbour, and
			between the rows runs a thin line of mortar whose lightness sits somewhere between the two.
		</p>
		<p>
			The mortar is the key. Where a dark tile and a light tile face each other across the grey
			line, the small-scale filters in early vision see a short, slightly tilted edge segment rather
			than a piece of horizontal line; the row shift lines those segments up at an angle, and
			chaining enough of them makes the whole line tilt. The zig-zag of the row shifts tilts
			neighbouring lines in opposite directions, hence the wedges. Gregory and Heard called the
			underlying effect
			<em>border locking</em>. That is the common explanation, at least; there are several competing
			models of the details.
		</p>
		<p>Things to try:</p>
		<ul>
			<li>
				<strong>Mortar lightness</strong> at 0 or 1: with black or white mortar the lines straighten out
				immediately.
			</li>
			<li>
				<strong>Mortar width:</strong> the illusion likes it thin; make it thick and you're looking at
				grey stripes between tiles.
			</li>
			<li>
				<strong>Row shift</strong> at 0 stacks the tiles into columns for comparison. Then find the shift
				where it's strongest on your screen.
			</li>
		</ul>
		<p class="sources">
			Sources: Gregory &amp; Heard (1979), Border locking and the Café Wall illusion,
			<em>Perception</em> 8; Michael Bach,
			<a href="https://michaelbach.de/ot/ang-cafewall/">Café Wall</a>.
		</p>
	{/snippet}
</PhenomenonLayout>
