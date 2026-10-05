<script setup>
import { DialogClose, DialogContent, DialogOverlay, DialogPortal } from 'reka-ui'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps({ class: { type: [String, Array, Object], default: '' }, showCloseButton: { type: Boolean, default: true } })
// Primitive props and listeners are forwarded as attrs. Reka owns the focus trap,
// Escape/outside dismissal, description IDs, inert background and focus restoration.
</script>
<template>
  <DialogPortal>
    <DialogOverlay data-slot="dialog-overlay" class="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogContent data-slot="dialog-content" v-bind="$attrs" :class="cn('bg-background fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95', props.class)">
      <slot />
      <DialogClose v-if="showCloseButton" data-slot="dialog-close" class="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-md opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"><X class="size-4" aria-hidden="true" /><span class="sr-only">Close</span></DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
<style>
/* Tailwind 4 uses individual translate properties; don't apply a second transform. */
.navigation-dialog[data-slot="dialog-content"] { translate: -50% 0 !important; transform: none !important; }
</style>
