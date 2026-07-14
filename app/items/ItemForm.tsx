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
import { StandardItem, SpecialtyItem } from "@/lib/models/inventory-item";
import { Category } from "@/lib/models/category";
import { RoomLocation } from "@/lib/models/room-location";

export default function ItemForm({
  action,
  existingData = null,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  existingData?: InventoryItemRecord | null;
}) {
  const [coverageExplanationUnderstood, setCoverageExplanationUnderstood] = useState(false);
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

  function getCoverageRequirementsExplanation(type: "standard" | "specialty"): string {
    const dummyCategory = new Category("", "", "");
    const dummyRoom = new RoomLocation("", "");
    const base = {
      id: "",
      name: "",
      description: null,
      brand: null,
      model: null,
      identificationNumber: null,
      purchasePrice: 0,
      purchaseDate: null,
      roomLocation: dummyRoom,
      category: dummyCategory,
      allowedCategories: [],
    };
    if (type === "standard")
      return new StandardItem({
        ...base,
        coverageType: "standard",
        currentValue: null,
      }).getCoverageTypeExplanation();
    return new SpecialtyItem({
      ...base,
      coverageType: "specialty",
      currentValue: null,
    }).getCoverageTypeExplanation();
  }

  if (loading) return <LoadingSpinner />;

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
          onChange={(e) => {
            setCoverageType(e.target.value as "standard" | "specialty");
            setCoverageExplanationUnderstood(false);
          }}
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
      <div className="rounded border bg-white p-4">
        <p className="mb-2 text-sm">By checking this box, I understand the following:</p>
        <p className="mb-3 text-sm italic">{getCoverageRequirementsExplanation(coverageType)}</p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="accent-[#696eb5]"
            checked={coverageExplanationUnderstood}
            onChange={(e) => setCoverageExplanationUnderstood(e.target.checked)}
          />
          I understand
        </label>
      </div>

      <Link
        href="/items"

        className="rounded bg-[#696eb5] px-4 py-2 text-white font-bold disabled:opacity-50 mr-6 hover:bg-[#8a8ba6]"
      >
        CANCEL
      </Link>
      <button
        type="submit"
        disabled={pending || !coverageExplanationUnderstood}
        className="rounded cursor-pointer bg-primary px-4 py-2 text-white font-bold disabled:opacity-50 hover:bg-[#b59e59]"
      >
        {pending ? "Saving..." : "SAVE ITEM"}
      </button>
    </form>
  );
}
