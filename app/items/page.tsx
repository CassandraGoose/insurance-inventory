import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { getUserInventoryItems, deleteInventoryItem } from "@/db/actions";
import { SpecialtyItem } from "@/lib/models/inventory-item";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function InventoryItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user) redirect("/auth/sign-in");

  const { search } = await searchParams;
  const items = await getUserInventoryItems(search);

  return (
    <main className="container mx-auto md:w-full w-7/8 flex flex-col justify-center py-10 gap-6">
      <h2 className="text-xl md">Your Insurance Inventory Items:</h2>

      <div className="flex md:flex-row flex-col justify-between md:items-center items-baseline bg-[#e3dfde] p-4 rounded md:gap-0 gap-4">
        <Link
          href="/items/new"
          className="rounded py-2 bg-[#696eb5] p-2 text-white hover:bg-[#8a8ba6]"
        >
          + ADD NEW ITEM
        </Link>
        <div className="flex justify-center items-center gap-4">
          <form method="GET" className="flex items-center gap-2">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <input
              id="search"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search..."
              className="bg-white text-[#292f36] rounded border border-[#292f36] pl-2 py-1.5"
            />
            <button
              type="submit"
              className="rounded py-2 bg-[#696eb5] p-2 text-white hover:bg-[#8a8ba6]"
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>

      {items.length === 0 ? (
        <p>No Inventory Items could be found. Add new items or change the search term.</p>
      ) : (
        <main className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-600">
                <th className="p-2">Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Brand / Model</th>
                <th className="p-2">Purchase Price</th>
                <th className="p-2">Current Value</th>
                <th className="p-2">Room</th>
                <th className="p-2">Coverage</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{item.name}</td>
                  <td className="p-2">{item.category.name}</td>
                  <td className="p-2 text-sm">
                    {[item.brand, item.model].filter(Boolean).join(" / ") || "—"}
                  </td>
                  <td className="p-2">${Number(item.purchasePrice).toFixed(2)}</td>
                  <td className="p-2">
                    {item instanceof SpecialtyItem && item.currentValue != null
                      ? `$${Number(item.currentValue).toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="p-2">{item.roomLocation?.name ?? "—"}</td>
                  <td className="p-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.coverageType === "specialty"
                          ? "bg-[#bbbddd] text-[#292f36]"
                          : "bg-[#ffebad] text-[#292f36]"
                      }`}
                    >
                      {item.coverageType}
                    </span>
                  </td>
                  <td className="p-2 align-middle">
                    <div className="flex justify-center items-center gap-2">
                      <Link
                        href={`/items/${item.id}/edit`}
                        className="rounded bg-primary px-3 py-1 text-sm font-bold text-white hover:bg-[#b59e59]"
                      >
                        EDIT
                      </Link>
                      <form action={deleteInventoryItem}>
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          className="rounded bg-primary px-3 font-bold py-1 text-sm text-white hover:bg-[#b59e59]"
                        >
                          DELETE
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      )}
    </main>
  );
}
