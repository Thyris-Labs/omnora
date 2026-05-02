import type { routes } from "@omnora/api/registry";
import type { EndpointByMethodPattern, ResponseOf } from "@tuyau/core/types";

export type AllNotes = ResponseOf<EndpointByMethodPattern<typeof routes, "GET", "/api/v1/notes">>;
export type Directory = AllNotes["directories"][number];
export type Note = AllNotes["notes"][number];
export type TrashNotes = ResponseOf<
  EndpointByMethodPattern<typeof routes, "GET", "/api/v1/notes/trash">
>;
export type TrashDirectory = TrashNotes["directories"][number];
export type TrashNote = TrashNotes["notes"][number];
