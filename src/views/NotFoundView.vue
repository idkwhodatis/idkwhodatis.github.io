<script setup>
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
</script>
<template><main id="main-content" class="shell not-found" tabindex="-1"><p class="eyebrow">404 / A different direction</p><h1>This page isn't here.</h1><p>Let's get you back to the things that are.</p><Button as-child variant="outline"><RouterLink to="/">Back to the portfolio</RouterLink></Button></main></template>
