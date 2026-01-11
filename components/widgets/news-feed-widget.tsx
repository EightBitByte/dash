import { WidgetCard } from "@/components/widget-card";

export function NewsFeedWidget() {
  return (
    <WidgetCard title="News Feed" className="md:col-span-2">
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        News feed integration will appear here.
      </div>
    </WidgetCard>
  );
}
