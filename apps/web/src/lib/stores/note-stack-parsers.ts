"use client"

import { parseAsArrayOf, parseAsInteger, parseAsString } from "nuqs"

export const stackParser = parseAsArrayOf(parseAsString, ",").withDefault([])

export const focusParser = parseAsInteger

export const noteStackParsers = {
  stack: stackParser,
  focus: focusParser,
}

export function buildFullStack(
  rootSlug: string,
  additionalSlugs: string[]
): string[] {
  return [rootSlug, ...additionalSlugs]
}

export function getFocusIndex(
  focus: number | null,
  stackLength: number
): number {
  if (focus === null) {
    return Math.max(0, stackLength - 1)
  }
  return Math.min(Math.max(0, focus), stackLength - 1)
}

export function buildStackUrl(stack: string[], focusIndex?: number): string {
  if (stack.length === 0) {
    return "/manifesto"
  }

  const rootSlug = stack[0]
  const additionalSlugs = stack.slice(1)

  const basePath =
    rootSlug === "index" ? "/manifesto" : `/manifesto/${rootSlug}`

  const params = new URLSearchParams()
  if (additionalSlugs.length > 0) {
    params.set("stack", additionalSlugs.join(","))
  }
  if (focusIndex !== undefined && focusIndex !== stack.length - 1) {
    params.set("focus", String(focusIndex))
  }

  const queryString = params.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}

export function pushToStack(
  currentStack: string[],
  newSlug: string,
  fromIndex: number
): string[] {
  if (currentStack.length === 0) {
    return [newSlug]
  }
  const safeIndex = Math.min(Math.max(fromIndex, 0), currentStack.length - 1)
  return [...currentStack.slice(0, safeIndex + 1), newSlug]
}

export function popFromStack(currentStack: string[]): string[] {
  if (currentStack.length <= 1) {
    return currentStack
  }
  return currentStack.slice(0, -1)
}
