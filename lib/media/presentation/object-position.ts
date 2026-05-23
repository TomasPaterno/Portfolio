export function focalToObjectPosition(focalX = 0.5, focalY = 0.5): string {
  const x = Math.min(1, Math.max(0, focalX)) * 100;
  const y = Math.min(1, Math.max(0, focalY)) * 100;
  return `${x}% ${y}%`;
}
