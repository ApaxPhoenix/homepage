import type { ComponentProps } from "react";

// Outbound link. Opens in a new tab; ExitModal intercepts the click first to
// warn that the visitor is leaving the site.
export function Ext(props: ComponentProps<"a">) {
  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}
