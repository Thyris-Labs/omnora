import * as v from "valibot";

export function createSignupSchema(isVerifying: () => boolean) {
  return v.pipe(
    v.object({
      email: v.pipe(
        v.string("An email is required"),
        v.trim(),
        v.email("The given email is invalid."),
      ),
      username: v.pipe(v.string("A username is required"), v.trim()),
      code: v.optional(v.pipe(v.string(), v.trim())),
    }),
    v.forward(
      v.partialCheck(
        [["code"]],
        ({ code }) => !isVerifying() || Boolean(code),
        "A verification code is required",
      ),
      ["code"],
    ),
  );
}

export type SignupPayload = v.InferInput<ReturnType<typeof createSignupSchema>>;

export function createSigninSchema(isVerifying: () => boolean) {
  return v.pipe(
    v.object({
      email: v.pipe(
        v.string("An email is required"),
        v.trim(),
        v.email("The given email is invalid."),
      ),
      code: v.optional(v.pipe(v.string(), v.trim())),
    }),
    v.forward(
      v.partialCheck(
        [["code"]],
        ({ code }) => !isVerifying() || Boolean(code),
        "A verification code is required",
      ),
      ["code"],
    ),
  );
}

export type SigninPayload = v.InferInput<ReturnType<typeof createSigninSchema>>;
