import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Book, Briefcase, Calendar, User } from "lucide-react";

export type DeadlineType = keyof typeof DEADLINE_CATEGORIES;

export const DEADLINE_CATEGORIES = {
  exam: { label: "Exam", icon: Book },
  project: { label: "Project", icon: Briefcase },
  personal: { label: "Personal", icon: User },
  other: { label: "Other", icon: Calendar },
};

export interface DeadlineItem {
  id: string;
  title: string;
  date: string; // ISO string
  type: DeadlineType;
}

const STORAGE_KEY = "deadlines.json";

export async function getStoredDeadlines(): Promise<DeadlineItem[]> {
  try {
    console.log("Fetching deadlines from R2...");
    const { env } = await getCloudflareContext({ async: true });
    const obj = await env.DASH_BUCKET.get(STORAGE_KEY);
    console.log("R2 Fetch Result:", obj ? "Found" : "Null");

    if (!obj) {
      // Return default deadlines if empty
      return [];
    }

    const text = await obj.text();
    console.log("R2 Content:", text);
    return JSON.parse(text) as DeadlineItem[];
  } catch (error) {
    console.error("Failed to fetch deadlines from R2:", error);
    return [];
  }
}

export async function saveStoredDeadlines(deadlines: DeadlineItem[]) {
  try {
    console.log("Saving deadlines to R2...", JSON.stringify(deadlines));
    const { env } = await getCloudflareContext({ async: true });
    await env.DASH_BUCKET.put(STORAGE_KEY, JSON.stringify(deadlines));
    console.log("Save successful!");
  } catch (error) {
    console.error("Failed to save deadlines to R2:", error);
  }
}
