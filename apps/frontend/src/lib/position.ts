import { generateKeyBetween } from "fractional-indexing";

export function comparePositions(a: string, b: string): number {
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}

export function nextPositionAfter(
	sibling: { positionIdx: string } | null | undefined,
): string {
	return generateKeyBetween(sibling?.positionIdx, null);
}
