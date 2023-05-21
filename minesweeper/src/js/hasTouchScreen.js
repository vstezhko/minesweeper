export function hasTouchScreen() {
  return ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 0) || ('msMaxTouchPoints' in navigator && navigator.msMaxTouchPoints > 0);
}