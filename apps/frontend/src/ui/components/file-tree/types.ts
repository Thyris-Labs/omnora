import type { Component } from "svelte";
import type { SVGAttributes } from "svelte/elements";

export type FileTreeIcon = Component<SVGAttributes<SVGSVGElement>, {}>;

export interface FileTreeItem<TData = unknown> {
	kind: "item";
	id: string;
	type: string;
	title: string | null;
	positionIdx: string;
	data: TData;
	icon?: FileTreeIcon;
}

export interface FileTreeDirectory<TDirectory = unknown, TItem = unknown> {
	kind: "directory";
	id: string;
	title: string;
	positionIdx: string;
	data: TDirectory;
	items: Array<FileTreeItem<TItem>>;
}

export type FileTreeEntry<TDirectory = unknown, TItem = unknown> =
	| FileTreeDirectory<TDirectory, TItem>
	| FileTreeItem<TItem>;

export interface FileTreeContextMenuItem {
	label: string;
	action: () => void | Promise<void>;
	disabled?: boolean;
}

export interface FileTreeDirectoryActionContext<
	TDirectory = unknown,
	TItem = unknown,
> {
	directory: FileTreeDirectory<TDirectory, TItem>;
	open: boolean;
	toggle: () => void;
	startEditing: () => void;
}

export interface FileTreeItemActionContext<
	TDirectory = unknown,
	TItem = unknown,
> {
	item: FileTreeItem<TItem>;
	directory?: FileTreeDirectory<TDirectory, TItem>;
}
