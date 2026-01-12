"use client";

import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { logout } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight">Dash</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isLoggingOut}
            onClick={() => {
              setIsLoggingOut(true);
              const start = Date.now();
              console.log("Navigating to login via hard redirect...");

              logout().then(() => {
                console.log(
                  `Cookie deleted in ${Date.now() - start}ms, redirecting now.`,
                );
                window.location.assign("/login");
              });
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            {isLoggingOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
}
