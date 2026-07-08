// 'use server';

// import { auth } from '@/lib/auth/server';
// import { db } from './drizzle';
// import { category, room_location, item } from './schema';
// import { eq, desc, and } from 'drizzle-orm';
// import { revalidatePath } from 'next/cache';

// async function getAuthUser() {
//   const { data: session } = await auth.getSession();
//   if (!session?.user) throw new Error('Unauthorized');
//   return session.user;
// }

// export async function getCategories() {
//   return db.select().from(category);
// }

// export async function addTodo(formData: FormData) {
//   const user = await getAuthUser();
//   const text = formData.get('text') as string;
//   if (!text) return;

//   await db.insert(todos).values({ text, userId: user.id });

//   revalidatePath('/');
// }

// export async function toggleTodo(id: number, currentStatus: boolean) {
//   const user = await getAuthUser();

//   await db
//     .update(todos)
//     .set({ completed: !currentStatus })
//     .where(and(eq(todos.id, id), eq(todos.userId, user.id)));

//   revalidatePath('/');
// }

// export async function deleteTodo(id: number) {
//   const user = await getAuthUser();

//   await db.delete(todos).where(and(eq(todos.id, id), eq(todos.userId, user.id)));

//   revalidatePath('/');
// }
