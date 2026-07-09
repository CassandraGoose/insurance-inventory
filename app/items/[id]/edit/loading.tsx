// app/items/[id]/edit/loading.tsx
export default function Loading() {
  // todo does this only work automagically for server components? research.
  // if not, chagne all other loading to do the same steyl
  // todo add spinner.
  return (
    <div className="mx-auto max-w-lg">
      <p>Loading...</p>
    </div>
  );
}
