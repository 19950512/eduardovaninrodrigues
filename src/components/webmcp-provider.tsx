"use client";

import { useEffect } from "react";
import { initializeWebMCPPolyfill } from "@mcp-b/webmcp-polyfill";
import { registerSiteTools } from "@/lib/webmcp/register-site-tools";

/**
 * Registers the site's WebMCP tools (https://developer.chrome.com/docs/ai/webmcp)
 * so an on-page AI agent can search articles/practice areas and read contact
 * info. `initializeWebMCPPolyfill` is a safe no-op once Chrome ships native
 * `document.modelContext` support, or outside a secure browser context.
 */
export function WebMCPProvider() {
  useEffect(() => {
    initializeWebMCPPolyfill();
    return registerSiteTools();
  }, []);

  return null;
}
