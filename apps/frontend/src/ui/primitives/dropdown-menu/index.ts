import { DropdownMenu as BitsDropdownMenu } from "bits-ui";
import Content from "./content.svelte";
import Item from "./item.svelte";

export const Root = BitsDropdownMenu.Root;
export const Trigger = BitsDropdownMenu.Trigger;
export const Portal = BitsDropdownMenu.Portal;
export const Separator = BitsDropdownMenu.Separator;

export { Content, Item };

export default {
  Root,
  Trigger,
  Portal,
  Separator,
  Content,
  Item,
};
