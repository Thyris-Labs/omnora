import { createTuyau, type TuyauError } from "@tuyau/core/client";
import { registry } from "@omnora/api/registry";

export const client = createTuyau({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3333",
  registry,
  headers: { Accept: "application/json" },
  credentials: "include",
});

function hasMessage(response: unknown): response is { message: string } {
  return (
    typeof response === "object" &&
    response !== null &&
    "message" in response &&
    typeof response.message === "string"
  );
}

function hasValidationErrors(
  response: unknown,
): response is { errors: Array<{ message: string }> } {
  return (
    typeof response === "object" &&
    response !== null &&
    "errors" in response &&
    Array.isArray(response.errors) &&
    typeof response.errors[0]?.message === "string"
  );
}

export function apiErrorMessage(error: TuyauError) {
  if (hasMessage(error.response)) return error.response.message;
  if (hasValidationErrors(error.response)) return error.response.errors[0].message;
  return error.message;
}
