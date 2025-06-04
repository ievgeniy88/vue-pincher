import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import VuePincher from "./vue-pincher.vue";

describe("VuePincher component", () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(VuePincher, {
      props: {
        image: { width: 100, height: 100, close: vi.fn() },
        readonly: false,
        showGrid: false,
        attention: [],
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("toggles grid overlay visibility", async () => {
    expect(wrapper.find(".grid-overlay").exists()).toBe(false);

    await wrapper.setProps({ showGrid: true });
    expect(wrapper.find(".grid-overlay").exists()).toBe(true);
  });
});
