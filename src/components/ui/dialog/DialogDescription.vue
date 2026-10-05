<script setup>
import { DialogDescription } from 'reka-ui'
import { cn } from '@/lib/utils'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>
<template><DialogDescription data-slot="dialog-description" :class="cn('text-muted-foreground text-sm leading-relaxed', props.class)"><slot /></DialogDescription></template>
