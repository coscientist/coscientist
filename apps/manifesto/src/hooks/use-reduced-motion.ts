import * as React from "react";

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    mql.addEventListener("change", onChange);
    setPrefersReducedMotion(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
}
