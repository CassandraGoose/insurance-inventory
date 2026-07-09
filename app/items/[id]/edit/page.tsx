import { redirect } from "next/navigation";
import { getItem, updateInventoryItem } from "@/db/actions";
import ItemForm from "../../ItemForm";
import { InventoryItemRecord } from "@/lib/models/inventory-item";

type FormState = { error?: string } | null;

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentItem = await getItem(id);
  // Next.js does some serialization magic when sending data.
  // this is kind of one of the reasons OOP/Classes don't work realistically in this ecosystem.
  // So, to get around this (since the project requires an OOP style), I'm going to
  // just convert the class instance to a plain old object right at this boundary
  // to display in a client component. Once it comes back and we work with it, it'll be converted back into a class.
  const plainItem = {
    ...currentItem,
    category: {
      id: currentItem.category.id,
      name: currentItem.category.name,
      coverage_type: currentItem.category.coverage_type,
    },
    roomLocation: { id: currentItem.roomLocation.id, name: currentItem.roomLocation.name },
  } as InventoryItemRecord;

  async function action(prev: FormState, formData: FormData) {
    "use server";
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
      await updateInventoryItem(id, data);
    } catch (error) {
      return { error: (error as Error).message };
    }

    redirect("/items");
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 text-2xl font-bold">Edit {currentItem.name}</h1>
      <ItemForm action={action} existingData={plainItem} />
    </div>
  );
}
