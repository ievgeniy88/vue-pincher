<template>
  <VuePincher
    v-if="image"
    ref="pincher"
    v-model="settings"
    :image="image"
    :attention="attention"
  />
  <input
    type="button"
    value="Fill with attention"
    style="margin: 8px"
    @click="fillWithAttention"
  />
  <input
    type="button"
    value="Fill without attention"
    style="margin: 8px"
    @click="fillWithoutAttention"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from "vue";
import VuePincher from "../lib/VuePincher.vue";
import type { Region } from "../lib/crop";

const settings = ref({
  angle: 0,
  offsetX: 0,
  offsetY: 0,
  scale: 1,
});

const pincher = useTemplateRef("pincher");

const image = ref<ImageBitmap>();

const attention = ref<Region[]>();

onMounted(async () => {
  const response = await fetch("./test_vertical.jpg");
  const blob = await response.blob();
  image.value = await createImageBitmap(blob);
});

function fillWithAttention() {
  if (!pincher.value) return;
  attention.value = [{ x: 170, y: 1000, width: 100, height: 150 }];
  pincher.value.reset();
}

function fillWithoutAttention() {
  if (!pincher.value) return;
  attention.value = undefined;
  pincher.value.reset();
}
</script>
