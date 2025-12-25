import { Spinner } from "./shadcn";

export function Loading() {
  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
      <Spinner className="w-10 h-10" />
      <p className="text-center text-lg">Loading...</p>
    </div>
  );
}
