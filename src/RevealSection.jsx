// Plain section wrapper. Previously animated an opacity/translateY reveal on
// scroll-into-view; that entrance fired with no user action, so it's gone —
// sections now render fully and instantly. Kept as a component (and keeping the
// `index` prop as a no-op) so the seven concept pages don't need edits.
export function RevealSection({ children, className = "dx-section", index }) {
  void index;
  return <section className={className}>{children}</section>;
}
