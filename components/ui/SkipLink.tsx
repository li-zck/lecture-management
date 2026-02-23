"use client";

/**
 * Skip to main content link for keyboard and screen reader users.
 * WCAG 2.1 AA: Bypass Blocks (2.4.1) - allows users to skip repeated navigation.
 * Hidden off-screen by default, visible on focus (first Tab press).
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="fixed left-4 top-4 z-[100] -translate-x-[200%] rounded-md bg-primary px-4 py-2 text-primary-foreground outline-none ring-2 ring-ring ring-offset-2 transition-transform focus:translate-x-0 focus:translate-y-0 focus:outline-none"
    >
      Skip to main content
    </a>
  );
}
