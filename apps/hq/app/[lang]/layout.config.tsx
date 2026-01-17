import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

export function baseOptions(_lang: string): BaseLayoutProps {
  return {
    nav: {
      title: "Coscientist HQ",
    },
    i18n: true,
  }
}
