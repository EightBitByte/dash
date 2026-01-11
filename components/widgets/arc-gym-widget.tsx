import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WidgetCard } from "@/components/widget-card";
import { scrapeArcHours } from "@/lib/scrape";

export async function ArcGymWidget() {
  const { regular, upcoming } = await scrapeArcHours();

  return (
    <WidgetCard
      title="ARC Gym Hours"
      className="row-span-2"
      action={
        <Button variant="ghost" size="icon" asChild className="h-6 w-6">
          <Link
            href="https://www.campusrec.uci.edu/arc/hours.html"
            target="_blank"
            rel="noopener noreferrer"
            title="View official hours"
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">View official hours</span>
          </Link>
        </Button>
      }
    >
      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Regular Hours</h4>
            <ul className="space-y-1 text-muted-foreground">
              {regular.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          {upcoming.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-amber-600 dark:text-amber-400">
                Modified Hours
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                {upcoming.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
    </WidgetCard>
  );
}
