<template>
  <vue-pincher v-if="image" v-model="settings" :image="image" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const settings = ref({
  angle: 0,
  offsetX: 0,
  offsetY: 0,
  scale: 0,
});

const image = ref<ImageBitmap>();

onMounted(async () => {
  const response = await fetch("./test.jpg");
  const blob = await response.blob();
  image.value = await createImageBitmap(blob);
});
</script>
