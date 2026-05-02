import { generateKeyBetween } from "fractional-indexing";

export function comparePositions(a: string, b: string): number {
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}

type Sibling = { positionIdx: string } | null | undefined

export function nextPositionAfter(sibling: Sibling): string {
	return generateKeyBetween(sibling?.positionIdx, null);
}

export function moveBetween(prevSibling: Sibling, nextSibling: Sibling) {
	return generateKeyBetween(prevSibling?.positionIdx, nextSibling?.positionIdx)
}
