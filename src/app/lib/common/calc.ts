export function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

export function number2Hex(n: number, length: number = 2): string {
  return n.toString(16).padStart(length, "0").toUpperCase();
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
