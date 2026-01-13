import { CircleDot, ExternalLink, GitPullRequest } from "lucide-react";
import Link from "next/link";
import { RefreshButton } from "@/components/refresh-button";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WidgetCard } from "@/components/widget-card";
import { getGithubItems } from "@/lib/github";

export async function GithubIssuesWidget() {
  const { prs, issues } = await getGithubItems();
  const hasItems = prs.length > 0 || issues.length > 0;

  return (
    <WidgetCard
      title="GitHub Mentions"
      className="md:col-span-2"
      action={
        <div className="flex items-center gap-1">
          <RefreshButton />
          <Button variant="ghost" size="icon" asChild className="h-6 w-6">
            <Link
              href="https://github.com/notifications"
              target="_blank"
              rel="noopener noreferrer"
              title="View Notifications"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">View Notifications</span>
            </Link>
          </Button>
        </div>
      }
    >
      <ScrollArea className="h-[200px] pr-4">
        {!hasItems ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground space-y-2 pt-8">
            <CircleDot className="h-8 w-8 opacity-50" />
            <p>No active issues or PRs</p>
          </div>
        ) : (
          <div className="space-y-6">
            {prs.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-xs uppercase text-muted-foreground tracking-wider">
                  Pull Requests
                </h4>
                <div className="space-y-3">
                  {prs.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col space-y-1 border-l-2 border-purple-500 pl-3 py-1"
                    >
                      <div className="flex items-center gap-2">
                        <GitPullRequest className="h-4 w-4 text-purple-500" />
                        <Link
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 font-medium leading-none truncate hover:underline"
                        >
                          {item.title}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.repo}</span>
                        <span>•</span>
                        <span>#{item.number}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {issues.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-xs uppercase text-muted-foreground tracking-wider">
                  Issues
                </h4>
                <div className="space-y-3">
                  {issues.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col space-y-1 border-l-2 border-emerald-500 pl-3 py-1"
                    >
                      <div className="flex items-center gap-2">
                        <CircleDot className="h-4 w-4 text-emerald-500" />
                        <Link
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 font-medium leading-none truncate hover:underline"
                        >
                          {item.title}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.repo}</span>
                        <span>•</span>
                        <span>#{item.number}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </WidgetCard>
  );
}
