import * as v from "valibot";

export const updateUserDataSchema = v.object({
  displayName: v.pipe(
    v.string(),
    v.maxLength(24, "Your display name must be less than 24 characters"),
  ),
  username: v.pipe(v.string(), v.maxLength(24, "Your username must be less than 24 characters")),
});

export type UpdateUserDataPayload = v.InferInput<typeof updateUserDataSchema>;
