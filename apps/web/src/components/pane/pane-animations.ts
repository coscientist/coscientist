export const paneVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export const paneContentVariants = {
  collapsed: { opacity: 0.4, x: "var(--pane-spine-width)" },
  expanded: { opacity: 1, x: 0 },
}

export const spineVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const closeButtonVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
}
