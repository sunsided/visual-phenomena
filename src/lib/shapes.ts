export type Point = [number, number];

export interface Shape {
	/** Closed outline, centred on the origin, in viewBox units. */
	outline: Point[];
	/** Optional static shading drawn over the body (e.g. cube faces). */
	faces?: { points: Point[]; fill: string }[];
	/** Rotate the outline with the motion direction (arrows) or keep it upright (cubes). */
	followsDirection: boolean;
	/** viewBox width × height. */
	size: Point;
}

export type ShapeName = 'chevron' | 'circle' | 'square' | 'diamond' | 'cube';

function regular(count: number, radius: number, startDeg: number): Point[] {
	return Array.from({ length: count }, (_, i) => {
		const a = ((startDeg + (i * 360) / count) * Math.PI) / 180;
		return [radius * Math.cos(a), radius * Math.sin(a)];
	});
}

const hex = regular(6, 46, -90);

export const shapes: Record<ShapeName, Shape> = {
	chevron: {
		outline: [
			[-30, -50],
			[-8, -50],
			[30, 0],
			[-8, 50],
			[-30, 50],
			[8, 0]
		],
		followsDirection: true,
		size: [60, 100]
	},
	circle: { outline: regular(72, 45, 0), followsDirection: false, size: [100, 100] },
	square: {
		outline: [
			[-40, -40],
			[40, -40],
			[40, 40],
			[-40, 40]
		],
		followsDirection: false,
		size: [100, 100]
	},
	diamond: { outline: regular(4, 48, -90), followsDirection: false, size: [100, 100] },
	cube: {
		outline: hex,
		faces: [
			{ points: [hex[0], hex[1], [0, 0], hex[5]], fill: 'rgb(150 150 150)' },
			{ points: [hex[5], [0, 0], hex[3], hex[4]], fill: 'rgb(128 128 128)' },
			{ points: [[0, 0], hex[1], hex[2], hex[3]], fill: 'rgb(106 106 106)' }
		],
		followsDirection: false,
		size: [100, 100]
	}
};

export type EdgeRole = 'front' | 'back' | 'side';

/**
 * Splits a closed outline into runs of consecutive edges facing the motion
 * direction (front), facing away from it (back), or perpendicular to it
 * (side). Runs are returned as open polylines so joins stay mitred.
 */
export function edgeRuns(
	outline: Point[],
	directionDeg: number
): { role: EdgeRole; points: Point[] }[] {
	const n = outline.length;
	const d: Point = [
		Math.cos((directionDeg * Math.PI) / 180),
		Math.sin((directionDeg * Math.PI) / 180)
	];

	// Orientation decides which perpendicular points outwards.
	let area = 0;
	for (let i = 0; i < n; i++) {
		const [x1, y1] = outline[i];
		const [x2, y2] = outline[(i + 1) % n];
		area += x1 * y2 - x2 * y1;
	}
	const sign = area > 0 ? 1 : -1;

	const roles: EdgeRole[] = outline.map((p, i) => {
		const q = outline[(i + 1) % n];
		const normal: Point = [sign * (q[1] - p[1]), -sign * (q[0] - p[0])];
		const length = Math.hypot(normal[0], normal[1]);
		const dot = (normal[0] * d[0] + normal[1] * d[1]) / length;
		return dot > 1e-6 ? 'front' : dot < -1e-6 ? 'back' : 'side';
	});

	// Start at a role change so no run wraps around the end of the array.
	const start = roles.findIndex((r, i) => r !== roles[(i + n - 1) % n]);
	if (start === -1) return [{ role: roles[0], points: [...outline, outline[0]] }];

	const runs: { role: EdgeRole; points: Point[] }[] = [];
	for (let k = 0; k < n; k++) {
		const i = (start + k) % n;
		const p = outline[i];
		const q = outline[(i + 1) % n];
		const last = runs.at(-1);
		if (last && last.role === roles[i]) last.points.push(q);
		else runs.push({ role: roles[i], points: [p, q] });
	}
	return runs;
}

export function rotate(points: Point[], deg: number): Point[] {
	const a = (deg * Math.PI) / 180;
	const [c, s] = [Math.cos(a), Math.sin(a)];
	return points.map(([x, y]) => [x * c - y * s, x * s + y * c]);
}
