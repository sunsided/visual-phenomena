/**
 * Grey level for a sinusoid evaluated at `phase` (radians), in sRGB code values
 * centred on mid-grey. `contrast` 0–1 scales the swing; 1 spans ~#0d…#f2.
 * Interpolating in gamma-encoded space is not luminance-linear, which is fine
 * for a demo.
 */
export function modulated(phase: number, contrast: number): string {
	return grey(Math.sin(phase) * contrast);
}

/** Grey at a signed level -1 (darkest) … 1 (lightest) of the modulation range. */
export function grey(level: number): string {
	const v = Math.round((0.5 + 0.45 * level) * 255);
	return `rgb(${v} ${v} ${v})`;
}
