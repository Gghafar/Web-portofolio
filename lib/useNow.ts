"use client";

import { useSyncExternalStore } from "react";

let now: Date | null = null;
const getNow = () => (now ??= new Date());
const noop = () => () => {};

/**
 * Today's date on the client, `null` while prerendering. The page is exported at build time,
 * so anything that depends on "today" must wait for the visitor's clock to avoid stale or
 * mismatched HTML. One shared Date per page load keeps every caller consistent.
 */
export function useNow(): Date | null {
  return useSyncExternalStore(noop, getNow, () => null);
}
