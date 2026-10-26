export const CAPSULE_SECONDS = 30;
export function capsuleDuration(duration: number) {
  return Number.isFinite(duration) ? Math.min(CAPSULE_SECONDS, Math.max(0, duration)) : 0;
}
export function capsulePosition(position: number, duration: number) {
  return Number.isFinite(position) ? Math.min(capsuleDuration(duration), Math.max(0, position)) : 0;
}
