/**
 * To avoid ugly ternaries
 */
export function invoke(fn: undefined): undefined
export function invoke<T>(fn: () => T): T
export function invoke<T>(fn?: () => T): T | undefined {
	return fn?.() as T
}
