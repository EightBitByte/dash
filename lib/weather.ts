export interface WeatherData {
  current: {
    temperature: number;
    weatherCode: number;
  };
  daily: {
    min: number;
    max: number;
  };
}

export async function getWeather(): Promise<WeatherData> {
  // Use try/catch to handle build-time fetch failures nicely
  try {
    const latitude = "33.6846";
    const longitude = "-117.8265";
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch weather");
    }

    const data = await res.json();

    return {
      current: {
        temperature: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weather_code,
      },
      daily: {
        max: Math.round(data.daily.temperature_2m_max[0]),
        min: Math.round(data.daily.temperature_2m_min[0]),
      },
    };
  } catch (error) {
    console.warn("Weather fetch failed (using fallback data):", error);
    // Return fallback data so build doesn't crash
    return {
      current: { temperature: 72, weatherCode: 1 },
      daily: { min: 65, max: 75 },
    };
  }
}

export function getWeatherIcon(code: number) {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return "Sun"; // Clear sky
  if (code >= 1 && code <= 3) return "CloudSun"; // Mainly clear, partly cloudy, and overcast
  if (code >= 45 && code <= 48) return "CloudFog"; // Fog
  if (code >= 51 && code <= 57) return "CloudDrizzle"; // Drizzle
  if (code >= 61 && code <= 67) return "CloudRain"; // Rain
  if (code >= 71 && code <= 77) return "CloudSnow"; // Snow
  if (code >= 80 && code <= 82) return "CloudRainWind"; // Rain showers
  if (code >= 85 && code <= 86) return "CloudSnow"; // Snow showers
  if (code >= 95) return "CloudLightning"; // Thunderstorm
  return "Cloud";
}
