import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { getUserInventoryItems, deleteInventoryItem } from "@/db/actions";
import { SpecialtyItem } from "@/lib/models/inventory-item";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function InventoryItemsPage() {
  const { data: session } = await auth.getSession();

  if (!session?.user) redirect("/auth/sign-in");

  const items = await getUserInventoryItems();

  return (
    <div>
      <h1>Inventory Items</h1>
      <p>Welcome, {session.user.name}.</p>
      <div className="flex justify-between items-center">
        <Link href="/items/new" className="rounded py-2">
          + Add New Item
        </Link>
        <div className="flex justify-center items-center gap-4">
          <button>sort by?</button>
          <div>
            <label htmlFor="search">Search</label>
            <input id="search" name="search" />
          </div>
          <button>search</button>
        </div>
      </div>

      <h2>Your Insurance Inventory Items:</h2>
      {items.length === 0 ? (
        <p>No Items Added.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-sm text-gray-600">
              <th className="p-2">Image</th>
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Brand / Model</th>
              <th className="p-2">Purchase Price</th>
              <th className="p-2">Current Value</th>
              <th className="p-2">Valuation</th>
              <th className="p-2">Room</th>
              <th className="p-2">Coverage</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <div className="h-12 w-12 rounded bg-gray-200" />
                </td>
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
                <td className="p-2">
                  <div
                    className="inline-block h-8 w-8 rounded bg-yellow-100"
                    title="Valuation proof placeholder"
                  />
                </td>
                <td className="p-2">{item.roomLocation?.name ?? "—"}</td>
                <td className="p-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.coverageType === "specialty"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.coverageType}
                  </span>
                </td>
                <td className="p-2 flex flex-column justify-center items-center gap-2">
                  <Link
                    href={`/items/${item.id}/edit`}
                    className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    Edit
                  </Link>
                  <form action={deleteInventoryItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
