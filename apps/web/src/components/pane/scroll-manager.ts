import { useCallback, useEffect, useRef } from "react"

export function useScrollManager(
  scrollToPaneRef?: React.MutableRefObject<((index: number) => void) | null>
) {
  const paneRefsMap = useRef<Map<number, HTMLElement>>(new Map())

  const getScrollBehavior = useCallback(() => {
    if (typeof window === "undefined") {
      return "smooth" as const
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth"
  }, [])

  const registerPaneRef = useCallback(
    (index: number, element: HTMLElement | null) => {
      if (element) {
        paneRefsMap.current.set(index, element)
      } else {
        paneRefsMap.current.delete(index)
      }
    },
    []
  )

  const scrollToPane = useCallback(
    (index: number) => {
      const targetPane = paneRefsMap.current.get(index)
      if (targetPane) {
        targetPane.scrollIntoView({
          behavior: getScrollBehavior(),
          block: "nearest",
          inline: "start",
        })
        targetPane.focus()
      }
    },
    [getScrollBehavior]
  )

  useEffect(() => {
    if (scrollToPaneRef) {
      scrollToPaneRef.current = scrollToPane
    }
    return () => {
      if (scrollToPaneRef) {
        scrollToPaneRef.current = null
      }
    }
  }, [scrollToPane, scrollToPaneRef])

  return {
    registerPaneRef,
    scrollToPane,
    paneRefsMap,
  }
}
