<script setup>
import { TabsTrigger } from 'reka-ui'
import { cn } from '@/lib/utils'
const props = defineProps({ value: { type: String, required: true }, class: { type: [String, Array, Object], default: '' } })
</script>
<template><TabsTrigger data-slot="tabs-trigger" :value="value" :class="cn('data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-3 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm', props.class)"><slot /></TabsTrigger></template>
