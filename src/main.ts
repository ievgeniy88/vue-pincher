import { createApp } from "vue";
import App from "./app.vue";
import VuePincher from "../lib/main.ts";

const app = createApp(App);

app.component("VuePincher", VuePincher);

app.mount("#app");
