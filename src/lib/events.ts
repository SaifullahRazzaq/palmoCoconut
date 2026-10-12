/** Tiny cross-section event: the collection asks the showcase to show a variant. */
export const SHOW_VARIANT = "palmo:show-variant";

export function requestVariant(id: string) {
  window.dispatchEvent(new CustomEvent(SHOW_VARIANT, { detail: id }));
}
