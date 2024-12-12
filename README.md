# Vue Pincher

Vue Pincher is a Vue 3 component that provides an easy-to-use image cropper, optimized for mobile and multitouch interactions. It's designed to make cropping images intuitive, whether you're working on desktop or mobile devices.

> **Note**: Yes, there are many image croppers out there, but see below.

## Key Features

- **Mobile and Multitouch Friendly**: Optimized for touchscreens, providing smooth pinch-to-zoom and drag-to-move capabilities.
- **Gesture Support**: Uses a gesture center to handle image manipulation, ensuring intuitive interactions with both touch and mouse inputs.
- **Portable state**: Maximized similarity in different size containers with same crop state.
- **Non-destructive behavior**: Original image is preserved for further manipulation.

## Installation

To install `vue-pincher`, simply run the following command:

```bash
npm install vue-pincher
```

Once installed, import and use the component in your Vue 3 application:

```typescript
import { createApp } from "vue";
import VuePincher from "vue-pincher";

const app = createApp(App);
app.component("VuePincher", VuePincher);
app.mount("#app");
```

## Basic Usage

```vue
<template>
  <VuePincher
    v-if="image"
    v-model="settings"
    :image="image"
    style="width: 300px; height: 300px"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import VuePincher from "vue-pincher";

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
```

## Contributing
Contributions are welcome! Feel free to open issues, suggest features, or submit pull requests.

## License
Vue Pincher is [MIT](./LICENSE) licensed.

## Sponsors
[BOFT LTD](https://boft.io/)
