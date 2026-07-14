"use client";
import { useActionState } from "react";
import { useEffect, useState } from "react";
import { getCategories, getRoomLocations, getCoverageTypes } from "@/db/actions";
import { InventoryItemRecord } from "@/lib/models/inventory-item";
import { CoverageType } from "@/lib/models/coverage-type";
import { FormState } from "@/lib/validations/inventory-item";
import FormInput from "./FormInput";
import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";

export default function ItemForm({
  action,
  existingData = null,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  existingData?: InventoryItemRecord | null;
}) {
  const [loading, setLoading] = useState(true);
  const [state, formAction, pending] = useActionState(action, null);
  const [coverageType, setCoverageType] = useState<"standard" | "specialty">(
    existingData?.coverageType ?? "standard",
  );
  const [categories, setCategories] = useState<
    { id: string; name: string; coverage_type_id: string }[]
  >([]);
  const [roomLocations, setRoomLocations] = useState<{ id: string; name: string }[]>([]);
  const [coverageTypeIdMap, setCoverageTypeIdMap] = useState<Record<string, string>>({});
  const filteredCategories = categories.filter(
    (category) => category.coverage_type_id === coverageTypeIdMap[coverageType],
  );

  useEffect(() => {
    async function loadData() {
      const [categories, rooms, coverageTypes] = await Promise.all([
        getCategories(),
        getRoomLocations(),
        getCoverageTypes(),
      ]);
      setCategories(categories);
      setRoomLocations(rooms);
      const coverageTypeObjects = coverageTypes.map(
        (coverageType) => new CoverageType(coverageType.id, coverageType.name),
      );
      setCoverageTypeIdMap({
        standard: coverageTypeObjects.find((coverageType) => coverageType.name === "standard")!.id,
        specialty: coverageTypeObjects.find((coverageType) => coverageType.name === "specialty")!
          .id,
      });
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;
  // todo i need to add validation (when i am at that point in the rubric) and i need to also make it clear to the user how to use the form via required strings and red and disabling the submit button until read and a cancel.
  return (
    <form action={formAction} className="md:w-1/2 space-y-4 rounded-xl bg-[#e3dfde] p-6 shadow-sm ">
      <FormInput
        id={"name"}
        label={"Name"}
        required
        defaultValue={existingData?.name}
        fieldError={state?.fieldErrors?.name}
      />
      <div>
        <label htmlFor="description" className="block font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="w-full rounded border p-2 bg-white"
          defaultValue={existingData?.description ?? ""}
        />
      </div>
      <div className="flex space-x-8">
        <FormInput
          id={"brand"}
          label={"Brand"}
          defaultValue={existingData?.brand}
          fieldError={state?.fieldErrors?.brand}
        />
        <FormInput
          id={"model"}
          label={"Model"}
          defaultValue={existingData?.model}
          fieldError={state?.fieldErrors?.model}
        />
      </div>

      <FormInput
        id={"identificationNumber"}
        label={"Identification Number"}
        defaultValue={existingData?.identificationNumber}
        fieldError={state?.fieldErrors?.identificationNumber}
      />

      <div className="flex space-x-8">
        <FormInput
          id={"purchasePrice"}
          label={"Purchase Price"}
          required
          type="number"
          step="0.01"
          defaultValue={existingData?.purchasePrice}
          fieldError={state?.fieldErrors?.purchasePrice}
        />
        <FormInput
          id={"purchaseDate"}
          label={"Purchase Date"}
          type="date"
          defaultValue={existingData?.purchaseDate?.toISOString().split("T")[0]}
          fieldError={state?.fieldErrors?.purchaseDate}
        />
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
          className="w-full rounded border p-2 bg-white"
        >
          <option value="standard">Standard</option>
          <option value="specialty">Specialty</option>
        </select>
      </div>

      {coverageType === "specialty" && (
        <FormInput
          id={"currentValue"}
          label={"Current Value"}
          required
          type="number"
          step="0.01"
          defaultValue={existingData?.currentValue}
          fieldError={state?.fieldErrors?.currentValue}
        />
      )}

      <div className="flex space-x-8">
        <div className="w-2/5">
          <label htmlFor="categoryId" className="block font-medium">
            Category (Required)
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="w-full rounded border p-2 bg-white"
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
        <div className="w-2/5">
          <label htmlFor="roomLocationId" className="block font-medium">
            Room Location (Required)
          </label>
          <select
            id="roomLocationId"
            name="roomLocationId"
            required
            className="w-full rounded border p-2 bg-white"
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
      </div>

      <Link
        href="/items"

        className="rounded bg-[#696eb5] px-4 py-2 text-white font-bold disabled:opacity-50 mr-6 hover:bg-[#8a8ba6]"
      >
        CANCEL
      </Link>
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-primary px-4 py-2 text-white font-bold disabled:opacity-50 hover:bg-[#b59e59]"
      >
        {pending ? "Saving..." : "SAVE ITEM"}
      </button>
    </form>
  );
}
