import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { getUserInventoryItems } from "@/db/actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { data: session } = await auth.getSession();

  if (!session?.user) redirect("/auth/sign-in");

  const items = await getUserInventoryItems();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.name}.</p>
      <h2>Your Insurance Inventory Items:</h2>
      {items.length === 0 ? (
        <p>No Items Added.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
