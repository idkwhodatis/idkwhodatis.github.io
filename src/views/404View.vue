<template>
  <div v-html="htmlContent"></div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const htmlContent = ref('');

    onMounted(async () => {
      const response = await fetch('../404/404.html');
      htmlContent.value = await response.text();
    });

    return { htmlContent };
  }
}
</script>