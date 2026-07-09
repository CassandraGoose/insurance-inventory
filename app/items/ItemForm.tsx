"use client";
import { useActionState } from "react";
import { useEffect, useState } from "react";
import { getCategories, getRoomLocations } from "@/db/actions";
import { InventoryItemRecord } from "@/lib/models/inventory-item";

export default function ItemForm({
  action,
  existingData = null,
}: {
  action: (
    prev: { error?: string } | null,
    formData: FormData,
  ) => Promise<{ error?: string } | null>;
  existingData?: InventoryItemRecord | null;
}) {
  const [loading, setLoading] = useState(true);
  const [, formAction, pending] = useActionState(action, null);
  const [coverageType, setCoverageType] = useState<"standard" | "specialty">(
    existingData?.coverageType ?? "standard",
  );
  const [categories, setCategories] = useState<
    { id: string; name: string; coverage_type: string }[]
  >([]);
  const [roomLocations, setRoomLocations] = useState<{ id: string; name: string }[]>([]);
  const filteredCategories = categories.filter(
    (category) => category.coverage_type === coverageType,
  );

  useEffect(() => {
    async function loadData() {
      const [categories, rooms] = await Promise.all([getCategories(), getRoomLocations()]);
      setCategories(categories);
      setRoomLocations(rooms);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading)
    return (
      <div>
        <p>Laoding...todo add spinner</p>
      </div>
    );
  // todo i need to add validation (when i am at that point in the rubric) and i need to also make it clear to the user how to use the form via required strings and red and disabling the submit button until read and a cancel.
  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block font-medium">
          Name *
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded border p-2"
          defaultValue={existingData?.name}
        />
      </div>
      {/* todo limit html items required and valid */}
      <div>
        <label htmlFor="description" className="block font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="w-full rounded border p-2"
          defaultValue={existingData?.description ?? ""}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="brand" className="block font-medium">
            Brand
          </label>
          <input
            id="brand"
            name="brand"
            className="w-full rounded border p-2"
            defaultValue={existingData?.brand ?? ""}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="model" className="block font-medium">
            Model
          </label>
          <input
            id="model"
            name="model"
            className="w-full rounded border p-2"
            defaultValue={existingData?.model ?? ""}
          />
        </div>
      </div>

      <div>
        <label htmlFor="identificationNumber" className="block font-medium">
          Identification Number
        </label>
        <input
          id="identificationNumber"
          name="identificationNumber"
          className="w-full rounded border p-2"
          defaultValue={existingData?.identificationNumber ?? ""}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="purchasePrice" className="block font-medium">
            Purchase Price *
          </label>
          <input
            id="purchasePrice"
            name="purchasePrice"
            type="number"
            step="0.01"
            required
            className="w-full rounded border p-2"
            defaultValue={existingData?.purchasePrice ?? ""}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="purchaseDate" className="block font-medium">
            Purchase Date
          </label>
          <input
            id="purchaseDate"
            name="purchaseDate"
            type="date"
            className="w-full rounded border p-2"
            defaultValue={existingData?.purchaseDate?.toISOString().split("T")[0] ?? ""}
          />
        </div>
      </div>

      <div>
        <label htmlFor="coverageType" className="block font-medium">
          Coverage Type
        </label>
        <select
          id="coverageType"
          name="coverageType"
          value={coverageType}
          onChange={(e) => setCoverageType(e.target.value as "standard" | "specialty")}
          className="w-full rounded border p-2"
        >
          <option value="standard">Standard</option>
          <option value="specialty">Specialty</option>
        </select>
      </div>

      {coverageType === "specialty" && (
        <div>
          <label htmlFor="currentValue" className="block font-medium">
            Current Value
          </label>
          <input
            id="currentValue"
            name="currentValue"
            type="number"
            step="0.01"
            className="w-full rounded border p-2"
            defaultValue={existingData?.currentValue ?? ""}
          />
        </div>
      )}

      <div>
        <label htmlFor="categoryId" className="block font-medium">
          Category *
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          className="w-full rounded border p-2"
          defaultValue={existingData?.category?.id ?? ""}
        >
          <option value="">Select a category</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="roomLocationId" className="block font-medium">
          Room Location *
        </label>
        <select
          id="roomLocationId"
          name="roomLocationId"
          required
          className="w-full rounded border p-2"
          defaultValue={existingData?.roomLocation?.id ?? ""}
        >
          <option value="">Select a room</option>
          {roomLocations.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Image upload placeholder — UI ready, not submitted yet */}
      <div>
        <label htmlFor="image" className="block font-medium">
          Image
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="w-full rounded border p-2"
        />
        <p className="mt-1 text-sm text-gray-500">Image upload coming soon.</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Item"}
      </button>
    </form>
  );
}
