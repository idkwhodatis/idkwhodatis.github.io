<script setup>
import { Primitive } from 'reka-ui'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
const props = defineProps({ variant: { type: String, default: 'default' }, as: { type: [String, Object, Function], default: 'span' }, asChild: Boolean, class: { type: [String, Array, Object], default: '' } })
const variants = cva('inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 transition-[color,box-shadow] overflow-hidden', {
  variants: { variant: {
    default: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    destructive: 'border-transparent bg-destructive text-white',
    outline: 'text-foreground',
  } }, defaultVariants: { variant: 'default' },
})
</script>
<template><Primitive data-slot="badge" :as="as" :as-child="asChild" :class="cn(variants({ variant }), props.class)"><slot /></Primitive></template>
