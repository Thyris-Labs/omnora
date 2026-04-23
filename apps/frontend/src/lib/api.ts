import { Result, TaggedError, type Result as ResultType } from "better-result"
import { fetch } from "@tauri-apps/plugin-http"
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

export class ApiAbortError extends TaggedError("ApiAbortError")<{
	status: number
	code: string
	message: string
}>() { }

export type ApiRequestError = ApiError | ApiAbortError

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
): Promise<ResultType<Response, ApiRequestError>> {
	const isFormData = init?.body instanceof FormData
	return Result.tryPromise({
		try: () =>
			fetch(import.meta.env.VITE_API_URL + path, {
				...init,
				credentials: "include",
				headers: {
					...(isFormData ? {} : { "Content-Type": "application/json" }),
					...init?.headers,
				},
			}),
		catch: (cause) => {
			if (cause instanceof DOMException && cause.name === "AbortError") {
				return new ApiAbortError({
					status: 0,
					code: "ERR_ABORTED",
					message: "The request was aborted.",
				})
			}

			return new ApiError({
				status: 0,
				code: "ERR_NETWORK",
				message: cause instanceof Error ? cause.message : "Could not reach the server.",
			})
		},
	}).then((result) =>
		result.andThenAsync(async (response) => {
			if (!response.ok) return Result.err(await parseApiError(response))
			return Result.ok(response)
		}),
	)
}
