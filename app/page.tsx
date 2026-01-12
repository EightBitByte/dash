import { DashboardShell } from "@/components/dashboard-shell";
import { Header } from "@/components/header";
import { ArcGymWidget } from "@/components/widgets/arc-gym-widget";
import { DeadlinesWidget } from "@/components/widgets/deadlines-widget";
import { DealsWidget } from "@/components/widgets/deals-widget";
import { GithubIssuesWidget } from "@/components/widgets/github-issues-widget";
import { WeatherWidget } from "@/components/widgets/weather-widget";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <DashboardShell>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <WeatherWidget />
          <ArcGymWidget />

          <GithubIssuesWidget />
          <DealsWidget />
          <DeadlinesWidget />
        </div>
      </DashboardShell>
    </div>
  );
}
