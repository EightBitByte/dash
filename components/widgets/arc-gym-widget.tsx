import { WidgetCard } from "@/components/widget-card";

export function ArcGymWidget() {
  return (
    <WidgetCard title="ARC Gym Hours">
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Gym hours data will appear here.
      </div>
    </WidgetCard>
  );
}
