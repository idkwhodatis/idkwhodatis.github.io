<script setup>
import { TabsList } from 'reka-ui'
import { cn } from '@/lib/utils'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>
<template><TabsList data-slot="tabs-list" :class="cn('bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1', props.class)"><slot /></TabsList></template>
