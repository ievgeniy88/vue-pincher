<template>
  <div
    class="fit"
    style="position: relative"
    @mousedown="handler?.mouseDown"
    @touchstart="handler?.touchDown"
    @wheel="handler?.wheel"
    @dblclick="handler?.dblclick"
  >
    <canvas ref="canvasRef" class="fit" />
    <Transition>
      <div v-if="showGrid" class="grid-overlay" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, onUnmounted, watch } from "vue";
import { ImageManipulator } from "./manipulator";
import { InputHandler } from "./input_handler";
import type { Region } from "./crop";

const {
  image,
  readonly = false,
  showGrid = false,
  attention = [],
} = defineProps<{
  image: ImageBitmap;
  readonly?: boolean;
  showGrid?: boolean;
  attention?: Region[];
}>();

defineExpose({
  rotate,
  rotateTo,
  reset,
  showRegion,
});

const settings = defineModel<{
  angle: number;
  offsetX: number;
  offsetY: number;
  scale: number;
}>({
  default: { angle: 0, offsetX: 0, offsetY: 0, scale: 0 },
});

const canvas = useTemplateRef("canvasRef");

let manipulator: ImageManipulator;
let handler: InputHandler | undefined = undefined;

onMounted(() => {
  if (!canvas.value) return;

  const context = canvas.value.getContext("2d");

  if (!context) return;

  manipulator = new ImageManipulator(context, image, settings.value, attention);

  if (!readonly) {
    handler = new InputHandler(manipulator);
  }
});

onUnmounted(() => {
  manipulator?.close();
});

watch(
  () => image,
  (value) => (manipulator.image = value),
);

watch(
  () => attention,
  (value) => (manipulator.attention = value),
);

watch(settings, (value) => (manipulator.state = value), {
  deep: true,
});

/**
 * Resets image view to default state.
 */
function reset() {
  manipulator.reset();
}

function rotate(delta: number) {
  manipulator.manipulate({
    dAngle: delta,
  });
}

function rotateTo(angle: number) {
  manipulator.manipulate({
    angle,
  });
}

function showRegion(region: Region) {
  manipulator.showRegion(region);
}

if (!readonly) {
  window.addEventListener("touchmove", touchMoving);
  window.addEventListener("touchend", touchUp);
  window.addEventListener("mousemove", mouseMoving);
  window.addEventListener("mouseup", mouseUp);

  onUnmounted(() => {
    window.removeEventListener("touchmove", touchMoving);
    window.removeEventListener("touchend", touchUp);
    window.removeEventListener("mousemove", mouseMoving);
    window.removeEventListener("mouseup", mouseUp);
  });
}

function touchMoving(event: TouchEvent) {
  handler?.touchMoving(event);
}

function touchUp() {
  handler?.touchUp();
}

function mouseMoving(event: MouseEvent) {
  handler?.mouseMoving(event);
}

function mouseUp() {
  handler?.mouseUp();
}
</script>

<style scoped>
.grid-overlay {
  position: absolute;
  margin: -1px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
      to right,
      rgb(235, 235, 235) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgb(235, 235, 235) 1px, transparent 1px);
  background-size: calc(100% / 6) calc(100% / 6);
}

.v-enter-active {
  transition: opacity 0.2s linear;
}
.v-leave-active {
  transition: opacity 0.6s linear;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.fit {
  width: 100% !important;
  height: 100% !important;
}
</style>
