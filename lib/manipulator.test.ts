import { describe, it, beforeEach, expect, vi } from "vitest";
import type { Region } from "./crop";
import { ImageManipulator } from "./manipulator";

describe("Image manipulator", () => {
  let ctx: CanvasRenderingContext2D;
  let image: ImageBitmap;
  let state: {
    angle: number;
    offsetX: number;
    offsetY: number;
    scale: number;
  };
  let trimTo: Region | undefined;
  let attention: Region[];
  let manipulator: ImageManipulator;

  Object.defineProperty(window, "devicePixelRatio", {
    value: 2,
  });

  beforeEach(async () => {
    vi.clearAllMocks();

    ctx = {
      canvas: { clientWidth: 100, clientHeight: 100 },
      save: vi.fn(),
      restore: vi.fn(),
      clearRect: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    image = {
      width: 800,
      height: 600,
      close: vi.fn(),
    } as unknown as ImageBitmap;

    state = { angle: 0, offsetX: 0, offsetY: 0, scale: 0 };
    trimTo = undefined;
    attention = [];

    manipulator = new ImageManipulator(ctx, image, state, trimTo, attention);
  });

  it("initializes with correct canvas size based on device pixel ratio", () => {
    expect(ctx.canvas.width).toBe(200);
    expect(ctx.canvas.height).toBe(200);

    expect(ctx.drawImage).toBeCalledTimes(1);
    expect(ctx.drawImage).toHaveBeenCalledWith(
      image,
      -33.333333333333314,
      0,
      266.66666666666663,
      200,
    );
  });

  it("resets with the correct region when trimTo is set", async () => {
    trimTo = { x: 10, y: 10, width: 300, height: 300 };
    manipulator.trimTo = trimTo;

    vi.spyOn(manipulator, "showRegion");
    manipulator.reset();

    await flushPromises();

    expect(manipulator.showRegion).toHaveBeenCalledWith(trimTo, true);
  });

  it("resets with the correct region when attention is set", async () => {
    attention = [{ x: 10, y: 10, width: 100, height: 100 }];
    manipulator.attention = attention;

    vi.spyOn(manipulator, "showRegion");
    manipulator.reset();

    await flushPromises();

    expect(manipulator.showRegion).toHaveBeenCalledWith({
      height: 600,
      width: 600,
      x: -240,
      y: -240,
    });
  });

  it("adjusts scale and offsets correctly in the manipulate method", () => {
    const manipulation = {
      scale: 2,
      dOffsetX: 0.1,
      dOffsetY: -0.1,
    };
    manipulator.manipulate(manipulation);

    expect(state.scale).toBeGreaterThan(1);
    expect(state.offsetX).toBeGreaterThan(0);
    expect(state.offsetY).toBeLessThan(0);
  });

  it("coerces angles correctly in manipulate", () => {
    manipulator.manipulate({ angle: 370 });
    expect(state.angle).toBe(10); // Expect 370 to wrap around to 10 degrees
  });

  it("draws the image correctly based on current settings in redraw", () => {
    vi.spyOn(ctx, "drawImage");
    manipulator.image = {
      width: 800,
      height: 600,
      close: vi.fn(),
    } as unknown as ImageBitmap; // Assume a valid ImageBitmap instance

    expect(ctx.drawImage).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
    );
  });

  it("calculates the current region correctly in getCurrentRegion", () => {
    const region = manipulator.getCurrentRegion();

    expect(region.width).toBeGreaterThan(0);
    expect(region.height).toBeGreaterThan(0);
    expect(region.x).toBeDefined();
    expect(region.y).toBeDefined();
  });

  it("disconnects the resizeObserver on close", () => {
    vi.spyOn(manipulator["resizeObserver"], "disconnect");
    manipulator.close();
    expect(manipulator["resizeObserver"].disconnect).toHaveBeenCalled();
  });
});

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}
