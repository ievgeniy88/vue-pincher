import { getDistance, getMidPoint } from "./crop";
import type { ImageManipulator } from "./manipulator";

export class InputHandler {
  constructor(private readonly manipulator: ImageManipulator) {}

  public wheel(evt: WheelEvent) {
    this.manipulator.manipulate({
      dScale: Math.sign(evt.deltaY) * -0.1 + 1,
      centerX: evt.offsetX * window.devicePixelRatio,
      centerY: evt.offsetY * window.devicePixelRatio,
    });
  }

  public dblclick() {
    this.manipulator.reset();
  }

  private manipulating = false;
  private previousClick: MouseEvent = new MouseEvent("click");
  private previousTouch: TouchEvent = new TouchEvent("touchstart");

  public mouseMoving(evt: MouseEvent) {
    if (this.manipulating) {
      const dx = evt.clientX - this.previousClick.x;
      const dy = evt.clientY - this.previousClick.y;
      this.mouseDown(evt);
      this.manipulator.manipulate({
        dOffsetX: dx,
        dOffsetY: dy,
      });
    }
  }

  public mouseDown(evt: MouseEvent) {
    this.manipulating = true;
    this.previousClick = evt;
  }

  public mouseUp() {
    this.manipulating = false;
  }

  public touchMoving(evt: TouchEvent) {
    if (!this.manipulating) return;

    if (
      evt.touches?.[0] &&
      this.previousTouch.touches?.[0] &&
      evt.touches.length === 1
    ) {
      const dx = evt.touches[0].clientX - this.previousTouch.touches[0].clientX;
      const dy = evt.touches[0].clientY - this.previousTouch.touches[0].clientY;
      this.manipulator.manipulate({
        dOffsetX: dx,
        dOffsetY: dy,
      });
      this.previousTouch = evt;
    } else if (evt.touches && evt.touches.length >= 2) {
      if (this.previousTouch.touches.length >= 2) {
        const start = getMidPoint(this.previousTouch);
        const current = getMidPoint(evt);

        const rect = (evt.target as HTMLElement).getBoundingClientRect();
        const x = current.x - rect.x;
        const y = current.y - rect.y;

        this.manipulator.manipulate({
          dScale: getDistance(evt) / getDistance(this.previousTouch),
          dOffsetX: current.x - start.x,
          dOffsetY: current.y - start.y,
          centerX: x * window.devicePixelRatio,
          centerY: y * window.devicePixelRatio,
        });
      }
      this.previousTouch = evt;
    } else {
      // It's mousemove click event
    }

    evt.preventDefault();
  }

  public touchDown(evt: TouchEvent) {
    if (evt.touches) {
      this.manipulating = true;
      this.previousTouch = evt;
    }
  }

  public touchUp() {
    this.manipulating = false;
  }
}
