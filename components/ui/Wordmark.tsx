import { ROUTES } from "@/lib/utils";
import Link from "next/link";
import { StickerIcon } from "lucide-react";

export function Wordmark() {
  return (
    <Link href={ROUTES.mainSite.home}>
      <StickerIcon suppressHydrationWarning />
    </Link>
  );
}
