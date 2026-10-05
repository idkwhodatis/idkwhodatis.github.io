<script setup>
import { TabsContent } from 'reka-ui'
import { cn } from '@/lib/utils'
const props = defineProps({ value: { type: String, required: true }, class: { type: [String, Array, Object], default: '' } })
</script>
<template><TabsContent data-slot="tabs-content" :value="value" :class="cn('flex-1 outline-none', props.class)"><slot /></TabsContent></template>
