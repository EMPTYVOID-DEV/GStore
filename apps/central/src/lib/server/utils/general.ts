import { pathCheckModes } from '$server/const.server';
import type { PathCheckModes } from '$server/types.server';

export function checkPath(
	pathname: string,
	checkLevel: keyof PathCheckModes,
	checkerArray: string[]
) {
	const mode = pathCheckModes[checkLevel];
	for (const el of checkerArray) {
		if (mode == 0 && pathname.startsWith(el)) return true;
		if (mode == 1 && pathname.endsWith(el)) return true;
		if (mode == 2 && pathname.includes(el)) return true;
		if (mode == 3 && pathname === el) return true;
	}
	return false;
}
