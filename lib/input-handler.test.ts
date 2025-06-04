/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { InputHandler } from "./input-handler";
import type { ImageManipulator } from "./manipulator";

const mockManipulator = () => ({
  manipulate: vi.fn(),
  reset: vi.fn(),
});

describe("InputHandler", () => {
  let manipulator: ImageManipulator;
  let inputHandler: InputHandler;

  beforeEach(() => {
    manipulator = mockManipulator() as unknown as ImageManipulator;
    inputHandler = new InputHandler(manipulator);
  });

  describe("wheel", () => {
    it("should call manipulate with correct parameters on wheel event", () => {
      Object.defineProperty(window, "devicePixelRatio", { value: 2 });

      inputHandler.wheel({
        deltaY: -100,
        offsetX: 50,
        offsetY: 100,
      } as WheelEvent);

      expect(manipulator.manipulate).toBeCalledTimes(1);
      expect(manipulator.manipulate).toHaveBeenCalledWith({
        dScale: 1.1,
        centerX: 100,
        centerY: 200,
      });
    });
  });

  describe("dblclick", () => {
    it("should reset manipulator on double click", () => {
      inputHandler.dblclick();
      expect(manipulator.reset).toBeCalledTimes(1);
    });
  });

  describe("mouseDown and mouseMoving", () => {
    it("should start manipulating and call manipulate on mouse move", () => {
      inputHandler.mouseDown({
        x: 100,
        y: 200,
      } as MouseEvent);
      inputHandler.mouseMoving({
        clientX: 110,
        clientY: 220,
      } as MouseEvent);
      inputHandler.mouseUp();
      inputHandler.mouseMoving({
        clientX: 200,
        clientY: 300,
      } as MouseEvent);

      expect(manipulator.manipulate).toBeCalledTimes(1);

      expect(manipulator.manipulate).toBeCalledWith({
        dOffsetX: 10,
        dOffsetY: 20,
      });
    });

    it("should not manipulating without mouseDown event", () => {
      inputHandler.mouseMoving({
        clientX: 110,
        clientY: 220,
      } as MouseEvent);

      expect(manipulator.manipulate).toBeCalledTimes(0);
    });
  });

  describe("touchDown and touchMoving", () => {
    it("should start manipulating and call manipulate on touch move", () => {
      inputHandler.touchDown({
        touches: [
          new Touch({
            identifier: 0,
            clientX: 100,
            clientY: 200,
            target: document.body,
          }),
        ],
        preventDefault: vi.fn(),
      } as unknown as TouchEvent);
      inputHandler.touchMoving({
        touches: [
          new Touch({
            identifier: 0,
            clientX: 110,
            clientY: 220,
            target: document.body,
          }),
        ],
        preventDefault: vi.fn(),
      } as unknown as TouchEvent);
      inputHandler.touchUp();
      inputHandler.touchMoving({
        touches: [
          new Touch({
            identifier: 0,
            clientX: 310,
            clientY: 320,
            target: document.body,
          }),
        ],
        preventDefault: vi.fn(),
      } as unknown as TouchEvent);

      expect(manipulator.manipulate).toBeCalledTimes(1);

      expect(manipulator.manipulate).toBeCalledWith({
        dOffsetX: 10,
        dOffsetY: 20,
      });
    });

    it("should handle multi-touch manipulation correctly", () => {
      const touchDownEvent = {
        touches: [
          new Touch({
            identifier: 0,
            clientX: 100,
            clientY: 200,
            target: document.body,
          }),
          new Touch({
            identifier: 1,
            clientX: 200,
            clientY: 300,
            target: document.body,
          }),
        ],
        target: {
          getBoundingClientRect: getRect,
        } as HTMLElement,
        preventDefault: vi.fn(),
      } as unknown as TouchEvent;

      const touchMoveEvent = {
        touches: [
          new Touch({
            identifier: 0,
            clientX: 120,
            clientY: 220,
            target: document.body,
          }),
          new Touch({
            identifier: 1,
            clientX: 220,
            clientY: 320,
            target: document.body,
          }),
        ],
        target: {
          getBoundingClientRect: getRect,
        } as HTMLElement,
        preventDefault: vi.fn(),
      } as unknown as TouchEvent;

      inputHandler.touchDown(touchDownEvent);
      inputHandler.touchMoving(touchMoveEvent);

      expect(manipulator.manipulate).toBeCalledTimes(1);
      expect(manipulator.manipulate).toBeCalledWith({
        dScale: 1,
        dOffsetX: 20,
        dOffsetY: 20,
        centerX: 340,
        centerY: 540,
      });
    });
  });
});

function getRect() {
  return { x: 0, y: 0, width: 500, height: 500 };
}
