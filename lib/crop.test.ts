import { expect, describe, it } from "vitest";
import {
  coerceAngle,
  convertDegreeToRadian,
  applyAttention,
  fill,
  fit,
  getDistance,
  getMidPoint,
} from "./crop";

describe("crop function", () => {
  it.each([
    [
      { width: 800, height: 800 },
      { width: 200, height: 400 },
      {
        x: 0,
        y: 0,
        width: 800,
        height: 800,
      },
      { x: 200, y: 0, width: 400, height: 800 },
    ],
    [
      { width: 800, height: 800 },
      { width: 200, height: 400 },
      {
        x: 400,
        y: 0,
        width: 400,
        height: 800,
      },
      { x: 400, y: 0, width: 400, height: 800 },
    ],
    [
      { width: 800, height: 800 },
      { width: 400, height: 200 },
      {
        x: 0,
        y: 0,
        width: 800,
        height: 800,
      },
      { x: 0, y: 200, width: 800, height: 400 },
    ],
    [
      { width: 800, height: 800 },
      {
        width: 912,
        height: 912,
      },
      {
        x: 380.41768618246715,
        y: 180.56385282861976,
        width: 327.6954262328474,
        height: 299.5808248936321,
      },
      {
        x: 144.26539929889083,
        y: -69.64573472456425,
        width: 800.0000000000001,
        height: 800.0000000000001,
      },
    ],
    [
      { width: 800, height: 800 },
      {
        width: 912,
        height: 1242,
      },
      {
        x: 380.41768618246715,
        y: 180.56385282861976,
        width: 327.6954262328474,
        height: 299.5808248936321,
      },
      {
        x: 250.54559253560586,
        y: -69.64573472456419,
        width: 587.43961352657,
        height: 800,
      },
    ],
    [
      { width: 800, height: 800 },
      {
        width: 936,
        height: 687,
      },
      {
        x: 380.41768618246715,
        y: 180.56385282861976,
        width: 327.6954262328474,
        height: 299.5808248936321,
      },
      {
        x: 144.26539929889088,
        y: 36.764521685692216,
        width: 800,
        height: 587.1794871794872,
      },
    ],
    [
      {
        width: 643,
        height: 900,
      },
      {
        width: 912,
        height: 912,
      },
      {
        x: 196.94985852665087,
        y: 140.60065429040714,
        width: 181.58140163250158,
        height: 187.1153469186113,
      },
      {
        x: -33.75944065709837,
        y: -87.34167225028722,
        width: 643,
        height: 643,
      },
    ],
    [
      {
        width: 643,
        height: 900,
      },
      {
        width: 912,
        height: 1242,
      },
      {
        x: 196.94985852665087,
        y: 140.60065429040714,
        width: 181.58140163250158,
        height: 187.1153469186113,
      },
      {
        x: -33.75944065709837,
        y: -203.67390909239248,
        width: 643,
        height: 875.6644736842105,
      },
    ],
    [
      {
        width: 643,
        height: 900,
      },
      {
        width: 936,
        height: 687,
      },
      {
        x: 196.94985852665087,
        y: 140.60065429040714,
        width: 181.58140163250158,
        height: 187.1153469186113,
      },
      {
        x: -33.75944065709837,
        y: -1.8144286605436264,
        width: 643,
        height: 471.9455128205128,
      },
    ],
    [
      {
        width: 1200,
        height: 900,
      },
      {
        width: 912,
        height: 912,
      },
      {
        x: 378.09495980711273,
        y: 291.61308814267625,
        width: 134.0663235620703,
        height: 120.18197630649311,
      },
      {
        x: -4.8718784118520375,
        y: -98.29592370407715,
        width: 899.9999999999999,
        height: 899.9999999999999,
      },
    ],
    [
      {
        width: 1200,
        height: 900,
      },
      {
        width: 912,
        height: 1242,
      },
      {
        x: 378.09495980711273,
        y: 291.61308814267625,
        width: 134.0663235620703,
        height: 120.18197630649311,
      },
      {
        x: 114.69333897945222,
        y: -98.29592370407727,
        width: 660.8695652173914,
        height: 900.0000000000001,
      },
    ],
    [
      {
        width: 1200,
        height: 900,
      },
      {
        width: 936,
        height: 687,
      },
      {
        x: 378.09495980711273,
        y: 291.61308814267625,
        width: 134.0663235620703,
        height: 120.18197630649311,
      },
      {
        x: -154.8718784118521,
        y: -88.68053908869257,
        width: 1200,
        height: 880.7692307692307,
      },
    ],

    [
      {
        width: 1200,
        height: 900,
      },
      {
        width: 912,
        height: 912,
      },
      {
        x: 716.0404042386073,
        y: 92.53974986163848,
        width: 155.59794098690455,
        height: 133.8004465768305,
      },
      {
        x: 193.8393747320597,
        y: -440.56002684994615,
        width: 899.9999999999999,
        height: 899.9999999999999,
      },
      true,
    ],
    [
      {
        width: 1200,
        height: 900,
      },
      {
        width: 912,
        height: 1242,
      },
      {
        x: 716.0404042386073,
        y: 92.53974986163848,
        width: 155.59794098690455,
        height: 133.8004465768305,
      },
      {
        x: 353.259664587132,
        y: -440.56002684994627,
        width: 660.8695652173914,
        height: 900.0000000000001,
      },
      true,
    ],
    [
      {
        width: 1200,
        height: 900,
      },
      {
        width: 936,
        height: 687,
      },
      {
        x: 716.0404042386073,
        y: 92.53974986163848,
        width: 155.59794098690455,
        height: 133.8004465768305,
      },
      {
        x: -6.160625267940418,
        y: -427.73951402943334,
        width: 1200,
        height: 880.7692307692307,
      },
      true,
    ],
    [
      {
        width: 1200,
        height: 900,
      },
      {
        width: 912,
        height: 912,
      },
      {
        x: 318.45265236773486,
        y: 113.00738037357802,
        width: 143.8889889476667,
        height: 115.8899136017179,
      },
      {
        x: 90.39714684156826,
        y: -129.04766282556298,
        width: 899.9999999999999,
        height: 899.9999999999999,
      },
      true,
    ],
    [
      {
        width: 1200,
        height: 900,
      },
      {
        width: 912,
        height: 1242,
      },
      {
        x: 318.45265236773486,
        y: 113.00738037357802,
        width: 143.8889889476667,
        height: 115.8899136017179,
      },
      {
        x: 170.10729176910442,
        y: -129.04766282556304,
        width: 660.8695652173914,
        height: 900.0000000000001,
      },
      true,
    ],
    [
      {
        width: 1200,
        height: 900,
      },
      {
        width: 936,
        height: 687,
      },
      {
        x: 318.45265236773486,
        y: 113.00738037357802,
        width: 143.8889889476667,
        height: 115.8899136017179,
      },
      {
        x: -9.602853158431799,
        y: -122.63740641530657,
        width: 1200,
        height: 880.7692307692307,
      },
      true,
    ],
  ])(
    "should crop image of size %o to fill target of of size %o according to attention information %o",
    (image, target, attention, expected, ruleOfThirds = false) => {
      const result = applyAttention(attention, image, target, ruleOfThirds);

      expect(result.x).toBeCloseTo(expected.x);
      expect(result.y).toBeCloseTo(expected.y);
      expect(result.width).toBeCloseTo(expected.width);
      expect(result.height).toBeCloseTo(expected.height);
    },
  );
});

describe("fill function", () => {
  it.each([
    {
      target: { width: 400, height: 400 },
      source: { width: 800, height: 800 },
      expectedScale: 0.5,
    },
    {
      target: { width: 800, height: 800 },
      source: { width: 100, height: 100 },
      expectedScale: 8,
    },
    {
      target: { width: 100, height: 100 },
      source: { width: 800, height: 800 },
      expectedScale: 0.125,
    },
    {
      target: { width: 100, height: 200 },
      source: { width: 700, height: 800 },
      expectedScale: 0.25,
    },
    {
      target: { width: 200, height: 100 },
      source: { width: 800, height: 700 },
      expectedScale: 0.25,
    },
    {
      target: { width: 200, height: 100 },
      source: { width: 400, height: 800 },
      expectedScale: 0.5,
    },
    {
      target: { width: 400, height: 800 },
      source: { width: 200, height: 100 },
      expectedScale: 8,
    },
  ])(
    "should return $expectedScale to fill target $target with source $source",
    ({ target, source, expectedScale }) => {
      expect(fill(source, target)).toBe(expectedScale);
    },
  );
});

describe("fit function", () => {
  it.each([
    [{ width: 400, height: 400 }, { width: 800, height: 800 }, 0.5],
    [{ width: 800, height: 800 }, { width: 100, height: 100 }, 8],
    [{ width: 100, height: 100 }, { width: 800, height: 800 }, 0.125],
    [
      { width: 100, height: 200 },
      { width: 700, height: 800 },
      0.14285714285714285,
    ],
    [
      { width: 200, height: 100 },
      { width: 800, height: 700 },
      0.14285714285714285,
    ],
    [{ width: 200, height: 100 }, { width: 400, height: 800 }, 0.125],
    [{ width: 400, height: 800 }, { width: 200, height: 100 }, 2],
  ])(
    "should return $expectedScale to fit target $target with source $source",
    (target, source, expected) => {
      expect(fit(source, target)).toBe(expected);
    },
  );
});

describe("coerceAngle function", () => {
  it.each([
    { input: 0, expected: 0 },
    { input: 90, expected: 90 },
    { input: -90, expected: -90 },
    { input: 450, expected: 90 },
    { input: -450, expected: -90 },
    { input: 180, expected: -180 },
    { input: 360, expected: 0 },
    { input: -360, expected: 0 },
    { input: 720, expected: 0 },
    { input: 1230, expected: 150 },
    { input: -1230, expected: -150 },
  ])("should return $expected for input $input", ({ input, expected }) => {
    expect(coerceAngle(input)).toBe(expected);
  });
});

describe("convertDegreeToRadian function", () => {
  it.each([
    { degrees: 0, radians: 0 },
    { degrees: 90, radians: Math.PI / 2 },
    { degrees: 180, radians: Math.PI },
    { degrees: 270, radians: (3 * Math.PI) / 2 },
    { degrees: 360, radians: 2 * Math.PI },
    { degrees: -90, radians: -Math.PI / 2 },
    { degrees: -180, radians: -Math.PI },
    { degrees: 45, radians: Math.PI / 4 },
    { degrees: -45, radians: -Math.PI / 4 },
  ])(
    "should return $radians radians for $degrees degrees",
    ({ degrees, radians }) => {
      expect(convertDegreeToRadian(degrees)).toBeCloseTo(radians);
    },
  );
});

describe("getMidPoint function", () => {
  it.each([
    {
      touches: [{ clientX: 0, clientY: 0 }],
      expected: { x: 0, y: 0 },
    },
    {
      touches: [{ clientX: 10, clientY: 10 }],
      expected: { x: 10, y: 10 },
    },
    {
      touches: [
        { clientX: 0, clientY: 0 },
        { clientX: 0, clientY: 0 },
      ],
      expected: { x: 0, y: 0 },
    },
    {
      touches: [
        { clientX: 1, clientY: 1 },
        { clientX: 1, clientY: 1 },
      ],
      expected: { x: 1, y: 1 },
    },
    {
      touches: [
        { clientX: -1, clientY: -1 },
        { clientX: -1, clientY: -1 },
      ],
      expected: { x: -1, y: -1 },
    },
    {
      touches: [
        { clientX: 0, clientY: 0 },
        { clientX: 10, clientY: 10 },
      ],
      expected: { x: 5, y: 5 },
    },
    {
      touches: [
        { clientX: 0, clientY: 0 },
        { clientX: 20, clientY: 0 },
      ],
      expected: { x: 10, y: 0 },
    },
    {
      touches: [
        { clientX: 5, clientY: 5 },
        { clientX: 15, clientY: 15 },
      ],
      expected: { x: 10, y: 10 },
    },
    {
      touches: [
        { clientX: 0, clientY: 0 },
        { clientX: 10, clientY: 10 },
        { clientX: 20, clientY: 20 },
      ],
      expected: { x: 10, y: 10 },
    },
  ])(
    "should return $expected for touches $touches",
    ({ touches, expected }) => {
      const event = createTouchEvent(touches);
      expect(getMidPoint(event)).toEqual(expected);
    },
  );
});

describe("getDistance function", () => {
  it.each([
    {
      touches: [
        { clientX: 0, clientY: 0 },
        { clientX: 3, clientY: 4 },
      ],
      expectedDistance: 5, // distance between (0,0) and (3,4) is 5
    },
    {
      touches: [
        { clientX: 0, clientY: 0 },
        { clientX: 6, clientY: 8 },
      ],
      expectedDistance: 10, // distance between (0,0) and (6,8) is 10
    },
    {
      touches: [
        { clientX: -3, clientY: -4 },
        { clientX: 0, clientY: 0 },
      ],
      expectedDistance: 5, // distance between (-3,-4) and (0,0) is 5
    },
    {
      touches: [
        { clientX: 1, clientY: 1 },
        { clientX: 2, clientY: 2 },
      ],
      expectedDistance: Math.sqrt(2), // distance between (1,1) and (2,2) is sqrt(2)
    },
    {
      touches: [
        { clientX: -1, clientY: -1 },
        { clientX: -2, clientY: -2 },
      ],
      expectedDistance: Math.sqrt(2), // distance between (-1,-1) and (-2,-2) is sqrt(2)
    },
    {
      touches: [
        { clientX: 0, clientY: 0 },
        { clientX: 0, clientY: 0 },
      ],
      expectedDistance: 0,
    },
  ])(
    "should return $expectedDistance for touches $touches ",
    ({ touches, expectedDistance }) => {
      const event = createTouchEvent(touches);
      expect(getDistance(event)).toBeCloseTo(expectedDistance);
    },
  );
});

describe("getDistance error handling", () => {
  it.each([
    {
      touches: [{ clientX: 0, clientY: 0 }],
    },
    {
      touches: [],
    },
  ])("should throw an error if $description are provided", ({ touches }) => {
    const event = createTouchEvent(touches);
    expect(() => getDistance(event)).toThrowError(
      "getDistance requires at least two touches",
    );
  });
});

describe("coerceAngle edge cases", () => {
  it("should handle very large positive and negative angles", () => {
    expect(coerceAngle(1e6)).toBeCloseTo(-80);
    expect(coerceAngle(-1e6)).toBeCloseTo(80);
  });
});

describe("getMidPoint edge cases", () => {
  it("should return NaN for empty touches", () => {
    const event = createTouchEvent([]);
    const result = getMidPoint(event);
    expect(result.x).toBeNaN();
    expect(result.y).toBeNaN();
  });
});

function createTouchEvent(
  touches: { clientX: number; clientY: number }[],
): TouchEvent {
  return {
    touches: touches.map(({ clientX, clientY }) => ({
      clientX,
      clientY,
    })) as unknown,
  } as TouchEvent;
}
