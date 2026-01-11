import { WidgetCard } from "@/components/widget-card";

export function WeatherWidget() {
  return (
    <WidgetCard title="Weather">
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        OpenWeather data will appear here.
      </div>
    </WidgetCard>
  );
}
