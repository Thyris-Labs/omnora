import * as v from "valibot"

export const updateUserDataSchema = v.object({
	// avatar: v.pipe(
	// 	v.file(),
	// 	v.mimeType(
	// 		["image/jpeg", "image/png"],
	// 		"Please select a JPEG or PNG file.",
	// 	),
	// 	v.maxSize(
	// 		1024 * 1024 * 10,
	// 		"Please select a file smaller than 10 MB.",
	// 	),
	// ),
	displayName: v.pipe(
		v.string(),
		v.maxLength(24, "Your display name must be less than 24 characters"),
	),
	username: v.pipe(
		v.string(),
		v.maxLength(24, "Your username must be less than 24 characters"),
	),
})


export type UpdateUserDataPayload = v.InferInput<typeof updateUserDataSchema>
