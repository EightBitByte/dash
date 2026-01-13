import { ExternalLink, Flame } from "lucide-react";
import Link from "next/link";
import { RefreshButton } from "@/components/refresh-button";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WidgetCard } from "@/components/widget-card";
import { getDeals } from "@/lib/deals";

export async function DealsWidget() {
  const deals = await getDeals();

  return (
    <WidgetCard
      title="Tech Deals"
      className="md:col-span-1"
      action={
        <div className="flex items-center gap-1">
          <RefreshButton />
          <Button variant="ghost" size="icon" asChild className="h-6 w-6">
            <Link
              href="https://slickdeals.net"
              target="_blank"
              rel="noopener noreferrer"
              title="Go to Slickdeals"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Go to Slickdeals</span>
            </Link>
          </Button>
        </div>
      }
    >
      <ScrollArea className="h-[200px] pr-4">
        {deals.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground space-y-2 pt-8">
            <Flame className="h-8 w-8 opacity-50" />
            <p>No active tech deals found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="flex gap-3 items-start border-b border-border pb-3 last:border-0"
              >
                <div className="relative h-12 w-12 flex-shrink-0 bg-muted rounded overflow-hidden">
                  {/* Use unoptimized image for external sources to avoid domain config issues initially */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {deal.image ? (
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Flame className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <Link
                    href={deal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium leading-tight hover:underline line-clamp-2"
                  >
                    {deal.title}
                  </Link>
                  <div className="flex items-center text-[10px] text-muted-foreground">
                    <span className="text-orange-500 font-bold mr-2">
                      Slickdeals
                    </span>
                    {deal.date && (
                      <span>{new Date(deal.date).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </WidgetCard>
  );
}
