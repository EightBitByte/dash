import { getDeadlinesAction } from "@/app/actions/deadlines";
import { DeadlinesInteractive } from "./deadlines-interactive";

export async function DeadlinesWidget() {
  const deadlines = await getDeadlinesAction();

  return (
    <DeadlinesInteractive initialDeadlines={deadlines} />
  );
}
