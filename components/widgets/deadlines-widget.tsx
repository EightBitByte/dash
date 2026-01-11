import { WidgetCard } from "@/components/widget-card";

export function DeadlinesWidget() {
  return (
    <WidgetCard title="Upcoming Deadlines">
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Manual deadlines list will appear here.
      </div>
    </WidgetCard>
  );
}
