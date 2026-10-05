<script setup>
import { useId } from 'vue'
defineProps({ scene: { type: Number, default: 0 } })
const id = useId().replace(/:/g, '')
</script>

<template>
  <svg aria-hidden="true" class="scene-art" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient :id="`${id}-glass`" x1="0" y1="0" x2="1" y2="1"><stop stop-color="currentColor" stop-opacity=".2" /><stop offset=".45" stop-color="currentColor" stop-opacity=".015" /><stop offset="1" stop-color="currentColor" stop-opacity=".08" /></linearGradient>
      <linearGradient :id="`${id}-edge`"><stop stop-color="currentColor" stop-opacity="0" /><stop offset=".5" stop-color="currentColor" stop-opacity=".7" /><stop offset="1" stop-color="currentColor" stop-opacity="0" /></linearGradient>
    </defs>
    <g fill="none" stroke="currentColor" stroke-width="1">
      <g v-if="scene === 0">
        <path d="M-40 370 90 299 180 112 338 58 460 28M744 42 946 87 1080 219 1017 378 1240 461" :stroke="`url(#${id}-edge)`" />
        <g transform="translate(60 170) rotate(-12)"><path d="m0 0 94-42 79 83-64 134-98-48Z" :fill="`url(#${id}-glass)`" stroke-opacity=".45" /><path d="m0 0 85 45 9-87M85 45l88-4M85 45l24 130M85 45l-74 82" stroke-opacity=".2" /></g>
        <g transform="translate(975 81) rotate(16)"><path d="M0 0h119v153H0Z" :fill="`url(#${id}-glass)`" stroke-opacity=".4" /><path d="M14 15h91v90H14ZM18 124h64M18 134h38m-19-45 24-26 22 13 20-35 22 41" stroke-opacity=".25" /></g>
        <g transform="translate(929 389) rotate(-12)"><path d="m0 0 111-35 83 35-111 35Zm0 25 83 35 111-35M0 50l83 35 111-35" :fill="`url(#${id}-glass)`" stroke-opacity=".4" /></g>
        <path d="m280 437 61-24 67 32-69 23Zm-3 19 62 27 70-23M796 58l24-30 24 30-25 23Z" :fill="`url(#${id}-glass)`" stroke-opacity=".35" />
      </g>
      <g v-else-if="scene === 1">
        <g v-for="i in 4" :key="i" :transform="`translate(${i < 3 ? 25 + i * 14 : 946 + i * 9} ${105 + (i % 2) * 135}) rotate(${i < 3 ? -15 : 15})`">
          <path d="M0 0h164v106H0Z" :fill="`url(#${id}-glass)`" stroke-opacity=".45" /><path d="M0 23h164M16 11h3m9 0h3m9 0h3M23 46 12 56l11 10m47-20 11 10-11 10M45 39l-10 34M17 88h97" stroke-opacity=".45" />
        </g>
        <path d="M50 412 267 457 394 394M818 98l142-35 201 70M43 68 189 31 341 81" :stroke="`url(#${id}-edge)`" />
      </g>
      <g v-else-if="scene === 2">
        <g v-for="(point, i) in [[30, 336], [190, 88], [917, 80], [1040, 367]]" :key="i" :transform="`translate(${point[0]} ${point[1]}) rotate(${i % 2 ? 10 : -9})`">
          <path d="m0 36 67-36 71 38-71 38Zm0 0v82l67 38 71-39V38M67 76v80" :fill="`url(#${id}-glass)`" stroke-opacity=".5" /><path d="m0 118 67-38 71 37M67 0v80" stroke-opacity=".14" />
        </g>
        <path d="M-20 470 106 445 229 292 319 321M905 398l95-112 98 30 145-146" stroke-dasharray="3 9" stroke-opacity=".3" />
        <path d="m287 402 16 18 28-37M991 66l13 14 23-29" stroke-opacity=".6" stroke-width="2" />
      </g>
      <g v-else>
        <path d="M-30 116C145 2 278 57 292 176S92 405 287 468 934 416 992 257 1093 69 1241 154L1228 183C1077 115 1090 273 1019 311S455 572 260 493 279 279 258 178 130 47-12 148Z" :fill="`url(#${id}-glass)`" stroke-opacity=".4" />
        <path d="M-24 390C147 472 279 399 219 297S97 65 301 45M972 492c-72-151 128-162 159-266" :stroke="`url(#${id}-edge)`" />
        <path v-for="i in 17" :key="i" :d="`M${55+i*8} ${265-Math.sin(i*.6)*48}v${35+Math.sin(i*.6)*96}`" stroke-opacity=".3" />
        <circle cx="1027" cy="147" r="42" stroke-opacity=".3" /><circle cx="1027" cy="147" r="12" stroke-opacity=".4" />
      </g>
      <path v-for="i in 12" :key="i" :d="`m${(i*193+47)%1200} ${(i*137+23)%560} 3-5 3 5-3 5Z`" fill="currentColor" stroke="none" :opacity="i % 3 === 0 ? .45 : .14" />
    </g>
  </svg>
</template>
