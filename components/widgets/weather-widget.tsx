import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  ExternalLink,
  Sun,
  Thermometer,
} from "lucide-react";
import Link from "next/link";
import { RefreshButton } from "@/components/refresh-button";
import { Button } from "@/components/ui/button";
import { WidgetCard } from "@/components/widget-card";
import { getWeather, getWeatherIcon } from "@/lib/weather";

export async function WeatherWidget() {
  const weather = await getWeather();
  const IconName = getWeatherIcon(weather.current.weatherCode);

  const icons: Record<string, any> = {
    Sun,
    CloudSun,
    CloudFog,
    CloudDrizzle,
    CloudRain,
    CloudSnow,
    CloudRainWind,
    CloudLightning,
    Cloud,
  };

  const WeatherIcon = icons[IconName] || Cloud;

  return (
    <WidgetCard
      title="Weather"
      action={
        <div className="flex items-center gap-1">
          <RefreshButton />
          <Button variant="ghost" size="icon" asChild className="h-6 w-6">
            <Link
              href="https://weather.com/weather/today/l/33.6846,-117.8265"
              target="_blank"
              rel="noopener noreferrer"
              title="View on Weather.com"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">View on Weather.com</span>
            </Link>
          </Button>
        </div>
      }
    >
      <div className="flex h-full flex-col justify-between py-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-4xl font-bold">
              {weather.current.temperature}°
            </span>
            <span className="text-sm text-muted-foreground">Irvine, CA</span>
          </div>
          <WeatherIcon className="h-10 w-10 text-sky-500" />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">H:</span>
            {weather.daily.max}°
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">L:</span>
            {weather.daily.min}°
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
