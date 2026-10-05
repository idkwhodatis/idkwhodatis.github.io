<script setup>
import { RouterLink } from 'vue-router'
import { ArrowDownRight, ArrowUpRight, Code2, Gamepad2, Music2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
const interests = [
  { name: 'Software', icon: Code2, color: '#99b4cc', description: 'Applications, developer tools, and experiments that turn a small frustration into something useful.' },
  { name: 'Games', icon: Gamepad2, color: '#a6b8a5', description: 'A space for mechanics, interaction, and the simple pleasure of making something playable.' },
  { name: 'Music', icon: Music2, color: '#c49aa6', description: 'Tracks and remixes. Different tools, the same impulse to create.' },
]
</script>

<template>
  <main id="main-content" class="shell about-page" tabindex="-1">
    <p class="eyebrow">Behind the collection</p>
    <h1>Different interests.<br /><span>The same curiosity.</span></h1>
    <div class="about-intro"><p>I’m idkwhodatis. This is a home for the software, games, and music I make — from practical tools to experiments that started with “what happens if?”</p><p>Not everything here belongs in the same category. That’s the point. Each project is another way to learn by making.</p></div>
    <div class="about-grid"><Card v-for="interest in interests" :key="interest.name" class="interest-card"><CardContent><component :is="interest.icon" :size="26" :stroke-width="1.3" :style="{ color: interest.color }" aria-hidden="true" /><h2>{{ interest.name }}</h2><p>{{ interest.description }}</p></CardContent></Card></div>
    <div class="about-links"><Button as-child variant="outline"><RouterLink :to="{ path: '/', hash: '#projects' }">Explore the work <ArrowDownRight :size="16" aria-hidden="true" /></RouterLink></Button><Button as-child variant="ghost"><a href="https://github.com/idkwhodatis" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight :size="16" aria-hidden="true" /></a></Button></div>
    <div class="colophon"><p class="eyebrow">The website, too, is a project.</p><p>Built with Vue and shadcn-vue. Quiet colors, fine lines, and a little room to breathe.</p><div><a href="https://github.com/idkwhodatis/idkwhodatis.github.io" target="_blank" rel="noopener noreferrer">View the source <ArrowUpRight :size="14" aria-hidden="true" /></a><a href="https://idkwhodatis.github.io/idkwhodatis.github.io-react/" target="_blank" rel="noopener noreferrer">Earlier React version <ArrowUpRight :size="14" aria-hidden="true" /></a></div></div>
  </main>
</template>
