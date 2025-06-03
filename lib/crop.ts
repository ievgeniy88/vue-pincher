export function applyAttention(
  attention: Region,
  image: Size,
  target: Size,
  ruleOfThirds = false,
): Region {
  const center = {
    x: attention.x + attention.width / 2,
    y: attention.y + attention.height / 2,
  };

  const scale = fill(image, target);

  const scaledWidth = target.width / scale;
  const scaledHeight = target.height / scale;

  if (ruleOfThirds) {
    const k = center.x < image.width / 2 ? 1 / 3 : 2 / 3;
    return {
      x: center.x - scaledWidth * k,
      y: center.y - scaledHeight * k,
      width: scaledWidth,
      height: scaledHeight,
    };
  } else {
    return {
      x: center.x - scaledWidth / 2,
      y: center.y - scaledHeight / 2,
      width: scaledWidth,
      height: scaledHeight,
    };
  }
}

export function fill(source: Size, target: Size) {
  return Math.max(target.width / source.width, target.height / source.height);
}

export function fit(source: Size, target: Size) {
  return Math.min(target.width / source.width, target.height / source.height);
}

export function coerceAngle(value: number) {
  value = ((value % 360) + 360) % 360;
  if (value >= 180) {
    value -= 360;
  }
  return value;
}

export function convertDegreeToRadian(rotate: number) {
  return rotate * (Math.PI / 180);
}

export function getMidPoint(evt: TouchEvent) {
  let totalX = 0;
  let totalY = 0;
  const touchCount = evt.touches.length;

  for (let i = 0; i < touchCount; i++) {
    totalX += evt.touches[i].clientX;
    totalY += evt.touches[i].clientY;
  }

  const midX = totalX / touchCount;
  const midY = totalY / touchCount;

  return { x: midX, y: midY };
}

export function getDistance(evt: TouchEvent) {
  const touch1 = evt.touches[0];
  const touch2 = evt.touches[1];

  const deltaX = touch2.clientX - touch1.clientX;
  const deltaY = touch2.clientY - touch1.clientY;

  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Size {
  width: number;
  height: number;
}
