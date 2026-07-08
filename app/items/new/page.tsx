"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createInventoryItem, getCategories, getRoomLocations } from "@/db/actions";
import ItemForm from "../ItemForm";

type FormState = { error?: string } | null;

export default function AddItemPage() {
  const router = useRouter();
  const [coverageType, setCoverageType] = useState<"standard" | "specialty">("standard");
  const [categories, setCategories] = useState<
    { id: string; name: string; coverage_type: string }[]
  >([]);
  const [roomLocations, setRoomLocations] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function loadData() {
      const [categories, rooms] = await Promise.all([getCategories(), getRoomLocations()]);
      setCategories(categories);
      setRoomLocations(rooms);
    }
    loadData();
  }, []);

  const filteredCategories = categories.filter(
    (category) => category.coverage_type === coverageType,
  );

  async function action(prev: FormState, formData: FormData) {
    const data = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      brand: (formData.get("brand") as string) || undefined,
      model: (formData.get("model") as string) || undefined,
      identificationNumber: (formData.get("identificationNumber") as string) || undefined,
      purchasePrice: Number(formData.get("purchasePrice")),
      purchaseDate: (formData.get("purchaseDate") as string) || undefined,
      currentValue: formData.get("currentValue") ? Number(formData.get("currentValue")) : undefined,
      coverageType: formData.get("coverageType") as "standard" | "specialty",
      categoryId: formData.get("categoryId") as string,
      roomLocationId: formData.get("roomLocationId") as string,
    };

    try {
      await createInventoryItem(data);
      router.push("/items");
      return null;
    } catch (error) {
      //todo wanna route to an error page?
      return { error: (error as Error).message };
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 text-2xl font-bold">Add New Item</h1>
      <ItemForm
        action={action}
        coverageType={coverageType}
        setCoverageType={setCoverageType}
        roomLocations={roomLocations}
        filteredCategories={filteredCategories}
      />
    </div>
  );
}
