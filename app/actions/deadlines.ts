
"use server";

import { DeadlineItem, getStoredDeadlines, saveStoredDeadlines } from "@/lib/deadlines-storage";
import { revalidatePath } from "next/cache";

export async function addDeadline(item: Omit<DeadlineItem, "id">) {
  const deadlines = await getStoredDeadlines();
  const newItem = { ...item, id: Math.random().toString(36).substring(7) };

  const updated = [...deadlines, newItem];
  await saveStoredDeadlines(updated);
  revalidatePath("/");
  return updated;
}

export async function updateDeadline(item: DeadlineItem) {
  const deadlines = await getStoredDeadlines();
  const updated = deadlines.map((d) => (d.id === item.id ? item : d));

  await saveStoredDeadlines(updated);
  revalidatePath("/");
  return updated;
}

export async function deleteDeadline(id: string) {
  const deadlines = await getStoredDeadlines();
  const updated = deadlines.filter((d) => d.id !== id);

  await saveStoredDeadlines(updated);
  revalidatePath("/");
  return updated;
}

export async function getDeadlinesAction() {
  return await getStoredDeadlines();
}
