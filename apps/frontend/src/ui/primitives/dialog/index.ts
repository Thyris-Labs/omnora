import { Dialog as BitsDialog } from "bits-ui";
import Content from "./content.svelte";
import Overlay from "./overlay.svelte";

export const Root = BitsDialog.Root;
export const Trigger = BitsDialog.Trigger;
export const Portal = BitsDialog.Portal;
export const Title = BitsDialog.Title;
export const Description = BitsDialog.Description;
export const Close = BitsDialog.Close;

export { Content, Overlay };

export default {
	Root,
	Trigger,
	Portal,
	Title,
	Description,
	Close,
	Content,
	Overlay,
};
