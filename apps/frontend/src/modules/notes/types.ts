export interface Directory {
	id: string
	name: string
	notes?: Array<Note>
}

export interface Note {
	id: string
	title?: string
	content?: string
}
