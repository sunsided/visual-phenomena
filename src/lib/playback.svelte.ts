import { MediaQuery } from 'svelte/reactivity';

/**
 * Play/pause state that starts paused when the OS asks for reduced motion,
 * until the user explicitly toggles it.
 */
export class Playback {
	#reducedMotion = new MediaQuery('prefers-reduced-motion: reduce');
	#choice = $state<boolean | null>(null);

	get playing(): boolean {
		return this.#choice ?? !this.#reducedMotion.current;
	}

	set playing(value: boolean) {
		this.#choice = value;
	}
}
