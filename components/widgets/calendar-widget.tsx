import { WidgetCard } from "@/components/widget-card";

export function CalendarWidget() {
  return (
    <WidgetCard title="Today's Events" className="md:col-span-2">
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Google Calendar events will appear here.
      </div>
    </WidgetCard>
  );
}
