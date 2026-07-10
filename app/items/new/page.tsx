"use client";

import { useRouter } from "next/navigation";
import { createInventoryItem } from "@/db/actions";
import ItemForm from "../ItemForm";
import { inventoryItemSchema } from "@/lib/validations/inventory-item";

type FormState = { error?: string } | null;

function validateData(data: unknown) {
  const parsed = inventoryItemSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const err of parsed.error.issues) {
      const path = err.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(err.message);
    }
    return { error: "Please fix the errors above.", fieldErrors };
  }

  return parsed.data;
}

export default function AddItemPage() {
  const router = useRouter();

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

    const validationResult = validateData(data);

    if ("error" in validationResult) return validationResult;

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
      <ItemForm action={action} />
    </div>
  );
}
