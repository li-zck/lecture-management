import Link from "next/link";
import { NotFoundHint } from "./not-found-hint";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-8 px-4">
        <Link href="/" className="inline-block mb-8">
          <h2 className="text-2xl font-bold text-primary">
            Lecture Management
          </h2>
        </Link>

        <div>
          <h1 className="text-8xl font-bold">404</h1>
          <p className="text-xl text-muted-foreground">Page not found</p>
        </div>

        <div className="pt-4">
          <NotFoundHint />
        </div>
      </div>
    </div>
  );
}
