import type { Component } from 'svelte';
import type { RouteId } from '$app/types';
import ArrowField from './components/organisms/ArrowField.svelte';
import CafeWall from './components/organisms/CafeWall.svelte';
import FloatingSphere from './components/organisms/FloatingSphere.svelte';
import FourStrokeField from './components/organisms/FourStrokeField.svelte';
import HueField from './components/organisms/HueField.svelte';
import LilacChaser from './components/organisms/LilacChaser.svelte';
import MotionInducedBlindness from './components/organisms/MotionInducedBlindness.svelte';
import RotatingSnakes from './components/organisms/RotatingSnakes.svelte';
import ScintillatingGrid from './components/organisms/ScintillatingGrid.svelte';
import SteppingFeet from './components/organisms/SteppingFeet.svelte';

export interface Phenomenon {
	slug: string;
	path: RouteId;
	title: string;
	summary: string;
	/** Organism rendered as the live thumbnail on the index page. */
	preview: { component: Component<any>; props?: Record<string, unknown> };
}

/** Registry driving the index page; each entry has a route at `path`. */
export const phenomena: Phenomenon[] = [
	{
		slug: 'moving-arrows',
		path: '/phenomena/moving-arrows',
		title: 'Moving arrows',
		summary:
			'Arrows that never move; only hairlines along their edges pulse against the background, a quarter cycle apart, and that is enough to send them marching.',
		preview: { component: ArrowField, props: { rows: 2, cols: 6, edge: 1.5 } }
	},
	{
		slug: 'four-stroke',
		path: '/phenomena/four-stroke',
		title: 'Four-stroke motion',
		summary:
			'Arrows that hop forward and straight back again, forever, and still appear to travel: every return hop swaps light and dark.',
		preview: { component: FourStrokeField, props: { rows: 2, cols: 6 } }
	},
	{
		slug: 'hue-rings',
		path: '/phenomena/hue-rings',
		title: 'Hue rings',
		summary:
			'Two rings spinning through the colour wheel, nailed to the spot, drifting towards their arrows anyway: two-pixel edges running a little ahead of the colour, or a little behind.',
		preview: { component: HueField }
	},
	{
		slug: 'rotating-snakes',
		path: '/phenomena/rotating-snakes',
		title: 'Rotating snakes',
		summary:
			'A completely static image (not a single animated pixel) that keeps turning anyway, at least wherever you are not looking.',
		preview: { component: RotatingSnakes, props: { rows: 1, cols: 2 } }
	},
	{
		slug: 'floating-sphere',
		path: '/phenomena/floating-sphere',
		title: 'Floating sphere',
		summary:
			'A ball in front of a honeycomb wall, both perfectly still, drifting in different directions anyway. Also, no, it is not a stress test.',
		preview: { component: FloatingSphere }
	},
	{
		slug: 'cafe-wall',
		path: '/phenomena/cafe-wall',
		title: 'Café wall',
		summary:
			'Perfectly parallel lines of grey mortar that refuse to look parallel, found on the wall of a café in Bristol.',
		preview: { component: CafeWall, props: { rows: 6, cols: 10 } }
	},
	{
		slug: 'scintillating-grid',
		path: '/phenomena/scintillating-grid',
		title: 'Scintillating grid',
		summary:
			'White discs that flash dark wherever you are not looking, and stubbornly stay white wherever you are.',
		preview: { component: ScintillatingGrid, props: { rows: 5, cols: 9 } }
	},
	{
		slug: 'lilac-chaser',
		path: '/phenomena/lilac-chaser',
		title: 'Lilac chaser',
		summary:
			'Twelve lilac discs, one of them missing at a time; stare at the cross for a while and a green disc shows up that was never drawn.',
		preview: { component: LilacChaser, props: { cross: true } }
	},
	{
		slug: 'motion-induced-blindness',
		path: '/phenomena/motion-induced-blindness',
		title: 'Motion-induced blindness',
		summary:
			'Three bright yellow dots that never change, and that vanish from view anyway once a blue pattern starts rotating behind them.',
		preview: { component: MotionInducedBlindness }
	},
	{
		slug: 'stepping-feet',
		path: '/phenomena/stepping-feet',
		title: 'Stepping feet',
		summary:
			'Two bars gliding at exactly the same speed that appear to take turns, step by step, as soon as there are stripes underneath.',
		preview: { component: SteppingFeet }
	}
];
