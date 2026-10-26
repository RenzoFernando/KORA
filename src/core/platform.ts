/** Offer installation in the product only on phones, even when a desktop window is narrow. */
export function isPhonePlatform(userAgent: string, mobileHint?: boolean) {
  if (/iPad|Tablet/i.test(userAgent)) return false;
  return mobileHint === true || /iPhone|iPod|Android.*Mobile|Windows Phone/i.test(userAgent);
}
