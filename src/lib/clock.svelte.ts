/**
 * A single requestAnimationFrame-driven phase accumulator. Driving every
 * modulated element from one clock keeps them in exact phase, which separate
 * CSS animations cannot guarantee. Changing the frequency never jumps the
 * phase. Must be constructed during component initialisation.
 */
export class PhaseClock {
	/** Current phase in radians, 0 ≤ phase < 2π. */
	phase = $state(0);

	constructor(frequency: () => number, paused: () => boolean) {
		$effect(() => {
			if (paused()) return;

			let last = performance.now();
			const tick = (now: number) => {
				const dt = (now - last) / 1000;
				last = now;
				this.phase = (this.phase + 2 * Math.PI * frequency() * dt) % (2 * Math.PI);
				id = requestAnimationFrame(tick);
			};
			let id = requestAnimationFrame(tick);
			return () => cancelAnimationFrame(id);
		});
	}
}
