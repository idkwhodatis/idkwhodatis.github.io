<script setup>
import { DialogTitle } from 'reka-ui'
import { cn } from '@/lib/utils'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>
<template><DialogTitle data-slot="dialog-title" :class="cn('text-lg leading-none font-semibold', props.class)"><slot /></DialogTitle></template>
