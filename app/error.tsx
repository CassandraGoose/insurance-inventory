"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg text-center py-12">
      <h2 className="text-xl font-bold mb-2">Oops! Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="rounded bg-primary px-4 py-2 text-white hover:bg-[#b59e59]"
      >
        Try again
      </button>
    </div>
  );
}
