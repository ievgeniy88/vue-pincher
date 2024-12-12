import type { Region } from "./crop";
import { coerceAngle, convertDegreeToRadian, crop, fill, fit } from "./crop";

export class ImageManipulator {
  private resizeObserver: ResizeObserver;
  private resetRequested = false;

  // Actual width and height of the canvas
  private clientWidth = 0;
  private clientHeight = 0;

  // Canvas DPI-adjusted width width and height using to mitigate blurry images on high DPI screens (phones, tablets, etc.)
  private canvasWidth = 0;
  private canvasHeight = 0;

  // Image width and height scaled to fit into canvas
  private fitWidth = 0;
  private fitHeight = 0;

  constructor(
    private _ctx: CanvasRenderingContext2D,
    private _image: ImageBitmap,
    private _state: State,
    private _attention: Region[] = [],
  ) {
    this.adjustSize();

    this.resizeObserver = new ResizeObserver(() => {
      if (!_ctx) return;

      this.adjustSize();

      if (this.resetRequested) {
        this.reset();
      } else {
        this.redraw();
      }
    });
    this.resizeObserver.observe(_ctx.canvas);

    if (_state.scale === 0) {
      this.reset();
    }
  }

  public set image(value: ImageBitmap) {
    this._image = value;
    this.redraw();
  }

  public set state(value: State) {
    this._state = value;
    this.redraw();
  }

  public set attention(value: Region[]) {
    this._attention = value;
  }

  public reset(lazy = false) {
    if (lazy) {
      this.resetRequested = true;
      return;
    }

    if (this._attention.length === 1) {
      this.showRegion(
        crop(
          this._attention[0],
          this._image,
          { width: this.canvasWidth, height: this.canvasHeight },
          true,
        ),
      );
    } else {
      const radian = convertDegreeToRadian(this._state.angle);
      const absCos = Math.abs(Math.cos(radian));
      const absSin = Math.abs(Math.sin(radian));

      const rotatedWidth = this.fitWidth * absCos + this.fitHeight * absSin;
      const rotatedHeight = this.fitHeight * absCos + this.fitWidth * absSin;

      this.manipulate({
        scale: fill(
          { width: rotatedWidth, height: rotatedHeight },
          { width: this.canvasWidth, height: this.canvasHeight },
        ),
        offsetX: 0,
        offsetY: 0,
      });
    }
  }

  public manipulate(data: Manipulation) {
    if (!this._ctx) return;
    if (Object.values(data).every((value) => value === undefined)) return;

    let changed = false;

    if (data.angle !== undefined || data.dAngle !== undefined) {
      const newAngle =
        data.angle !== undefined
          ? data.angle
          : this._state.angle + (data.dAngle ?? 0);

      const angle = coerceAngle(newAngle);

      if (this._state.angle !== angle) {
        this._state.angle = angle;
        changed = true;
      }
    }

    // Store previous scale before any changes
    const previousScale = this._state.scale;

    if (
      changed ||
      data.scale !== undefined ||
      data.dScale !== undefined ||
      data.offsetX !== undefined ||
      data.dOffsetX !== undefined ||
      data.offsetY !== undefined ||
      data.dOffsetY !== undefined
    ) {
      const radian = convertDegreeToRadian(this._state.angle);
      const absCos = Math.abs(Math.cos(radian));
      const absSin = Math.abs(Math.sin(radian));

      const rotatedWidth = this.fitWidth * absCos + this.fitHeight * absSin;
      const rotatedHeight = this.fitHeight * absCos + this.fitWidth * absSin;

      let scaleChanged = false;

      if (changed || data.scale !== undefined || data.dScale !== undefined) {
        const minScale = Math.min(
          this.canvasWidth / rotatedWidth,
          this.canvasHeight / rotatedHeight,
        );
        const newScale =
          data.scale !== undefined
            ? data.scale
            : this._state.scale * (data.dScale ?? 1);

        const scale = Math.max(minScale, newScale);

        if (this._state.scale !== scale) {
          this._state.scale = scale;
          scaleChanged = true;
          changed = true;
        }
      }

      // Adjust offsets based on scaling and center point
      if (scaleChanged) {
        const scaleRatio = this._state.scale / previousScale;

        const centerX =
          data.centerX !== undefined ? data.centerX : this.canvasWidth / 2;
        const centerY =
          data.centerY !== undefined ? data.centerY : this.canvasHeight / 2;

        const imageX =
          this.canvasWidth / 2 + this._state.offsetX * this.canvasWidth;
        const imageY =
          this.canvasHeight / 2 + this._state.offsetY * this.canvasHeight;

        const dx = centerX - imageX;
        const dy = centerY - imageY;

        this._state.offsetX += (dx - dx * scaleRatio) / this.canvasWidth;
        this._state.offsetY += (dy - dy * scaleRatio) / this.canvasHeight;
      }

      // Adjust offsetX
      if (
        changed ||
        data.offsetX !== undefined ||
        data.dOffsetX !== undefined
      ) {
        const offset =
          data.offsetX !== undefined
            ? data.offsetX
            : this._state.offsetX + (data.dOffsetX ?? 0) / this.clientWidth;

        const limit =
          Math.abs(this.canvasWidth - rotatedWidth * this._state.scale) /
          2 /
          this.canvasWidth;

        const coerced = Math.max(-limit, Math.min(offset, limit));

        if (this._state.offsetX !== coerced) {
          this._state.offsetX = coerced;
          changed = true;
        }
      }

      // Adjust offsetY
      if (
        changed ||
        data.offsetY !== undefined ||
        data.dOffsetY !== undefined
      ) {
        const offset =
          data.offsetY !== undefined
            ? data.offsetY
            : this._state.offsetY + (data.dOffsetY ?? 0) / this.clientHeight;

        const limit =
          Math.abs(this.canvasHeight - rotatedHeight * this._state.scale) /
          2 /
          this.canvasHeight;

        const coerced = Math.max(-limit, Math.min(offset, limit));

        if (this._state.offsetY !== coerced) {
          this._state.offsetY = coerced;
          changed = true;
        }
      }
    }

    if (changed) {
      this.redraw();
    }
  }

  public showRegion(region: Region) {
    const fitResult = fit(this._image, {
      width: this.canvasWidth,
      height: this.canvasHeight,
    });
    const scale = fit(region, {
      width: this.canvasWidth,
      height: this.canvasHeight,
    });

    const offsetX =
      (this._image.width * scale - this.canvasWidth - 2 * region.x * scale) /
      (2 * this.canvasWidth);
    const offsetY =
      (this._image.height * scale - this.canvasHeight - 2 * region.y * scale) /
      (2 * this.canvasHeight);

    this.manipulate({
      scale: scale / fitResult,
      offsetX,
      offsetY,
    });
  }

  public getCurrentRegion() {
    const scale = this._state.scale;

    const f = fit(this._image, {
      width: this.canvasWidth,
      height: this.canvasHeight,
    });

    return {
      x:
        (this._image.width * scale * f -
          this.canvasWidth -
          2 * this._state.offsetX * this.canvasWidth) /
        (scale * f * 2),
      y:
        (this._image.height * scale * f -
          this.canvasHeight -
          2 * this._state.offsetY * this.canvasHeight) /
        (scale * f * 2),
      width: this.canvasWidth / scale / f,
      height: this.canvasHeight / scale / f,
    };
  }

  public close() {
    this.resizeObserver.disconnect();
  }

  private adjustSize() {
    if (!this._ctx) return;

    this.clientWidth = this._ctx.canvas.clientWidth;
    this.clientHeight = this._ctx.canvas.clientHeight;

    this.canvasWidth = this._ctx.canvas.width =
      this.clientWidth * window.devicePixelRatio;
    this.canvasHeight = this._ctx.canvas.height =
      this.clientHeight * window.devicePixelRatio;

    // fit image into canvas
    const f = fit(this._image, {
      width: this.canvasWidth,
      height: this.canvasHeight,
    });

    this.fitWidth = this._image.width * f;
    this.fitHeight = this._image.height * f;
  }

  private redraw() {
    if (!this._ctx) return;

    const scale = this._state.scale;
    const scaledWidth = this.fitWidth * scale;
    const scaledHeight = this.fitHeight * scale;

    this._ctx.save();
    this._ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this._ctx.translate(
      this._state.offsetX * this.canvasWidth,
      this._state.offsetY * this.canvasHeight,
    );

    if (this._state.angle !== 0) {
      const cx = this.canvasWidth / 2;
      const cy = this.canvasHeight / 2;
      this._ctx.translate(cx, cy);
      this._ctx.rotate(convertDegreeToRadian(this._state.angle));
      this._ctx.translate(-cx, -cy);
    }

    this._ctx.drawImage(
      this._image,
      (this.canvasWidth - scaledWidth) / 2,
      (this.canvasHeight - scaledHeight) / 2,
      scaledWidth,
      scaledHeight,
    );
    this._ctx.restore();
  }
}

interface Manipulation {
  dAngle?: number;
  angle?: number;
  dScale?: number;
  scale?: number;
  dOffsetX?: number;
  offsetX?: number;
  dOffsetY?: number;
  offsetY?: number;
  centerX?: number;
  centerY?: number;
}

interface State {
  angle: number;
  offsetX: number;
  offsetY: number;
  scale: number;
}
