import { Result, TaggedError, type Result as ResultType } from "better-result"
import * as v from "valibot"

const ApiErrorSchema = v.object({
	status: v.number(),
	code: v.string(),
	message: v.string(),
})

export class ApiError extends TaggedError("ApiError")<{
	status: number
	code: string
	message: string
}>() { }

async function parseApiError(response: Response): Promise<ApiError> {
	const body = await response.json().catch(() => null)
	const parsed = v.safeParse(ApiErrorSchema, body)

	if (parsed.success) {
		return new ApiError(parsed.output)
	}

	return new ApiError({
		status: response.status,
		code: "ERR_UNKNOWN",
		message: "An unexpected error occurred.",
	})
}

export async function apiFetch(
	path: string,
	init?: RequestInit,
): Promise<ResultType<Response, ApiError>> {
	return Result.tryPromise({
		try: () =>
			fetch(import.meta.env.VITE_API_URL + path, {
				...init,
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					...init?.headers,
				},
			}),
		catch: (cause) =>
			new ApiError({
				status: 0,
				code: "ERR_NETWORK",
				message: cause instanceof Error ? cause.message : "Could not reach the server.",
			}),
	}).then((result) =>
		result.andThenAsync(async (response) => {
			if (!response.ok) return Result.err(await parseApiError(response))
			return Result.ok(response)
		}),
	)
}
