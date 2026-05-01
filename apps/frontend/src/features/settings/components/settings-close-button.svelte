<script lang="ts">
	import { Close as DialogClose } from "ui/primitives/dialog";
	import PhXBold from "~icons/ph/x-bold";
</script>

<DialogClose
	aria-label="Close settings"
	class="absolute top-2 right-2 flex size-6 items-center justify-center text-main-300 outline-none transition-ds hover:bg-main-700 hover:text-main-100 active:scale-[0.98] rounded"
>
	<PhXBold class="size-3.5" aria-hidden="true" />
</DialogClose>
