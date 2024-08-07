export interface Colors {
  [key: number]: string;
}

export interface Math {
  [key: string]: number;
}

export const ColorCollection: Colors = {
  0: "#EA3E3E", // red
  1: "#EA9D51", // orange
  2: "#FEEE43", // yellow
  3: "#BFEE3F", // green
  4: "#7FD4FF", // blue
  5: "#A97FFF", // purple
  6: "rgba(193, 220, 255, 0.6)",
};

export const MathCollection: Math = {
  pi: Math.PI,
  tau: Math.PI * 2,
};
