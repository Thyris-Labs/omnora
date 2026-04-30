<script lang="ts">
	import { Close as DialogClose } from "ui/primitives/dialog";
	import PhXBold from "~icons/ph/x-bold";
</script>

<DialogClose
	aria-label="Close settings"
	class="absolute top-2 right-2 flex size-6 items-center justify-center border border-main-800 text-main-500 outline-none transition-ds hover:border-main-500 hover:bg-main-900 hover:text-main-100 active:scale-[0.98]"
>
	<PhXBold class="size-3.5" aria-hidden="true" />
</DialogClose>
