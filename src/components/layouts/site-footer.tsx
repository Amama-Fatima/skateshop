import React from "react"
import Link from "next/link"
import { siteConfig } from "~/config/site"
import { cn } from "~/lib/utils"

import { Icons } from "../icons"
import { buttonVariants } from "../ui/button"
import { ThemeToggle } from "./theme-toggle"

const SiteFooter = () => {
  return (
    <footer className="w-full bg-background">
      <div className="container flex flex-col items-center justify-between space-y-1 border-t md:h-16 md:flex-row md:py-0">
        <div className="text-center text-base text-muted-foreground">
          Learn to Do a{" "}
          <a
            href="https://www.youtube.com/watch?v=kpVhjV-I6nM"
            aria-label="Kickflip tutorial on YouTube"
            target="_blank"
            rel="noreferrer"
            className="font-semibold transition-colors hover:text-slate-950 dark:hover:text-slate-200"
          >
            kickflip
          </a>
        </div>
        <div className="flex items-center space-x-1">
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <div
              className={cn(
                buttonVariants({
                  size: "sm",
                  variant: "ghost",
                }),
                "w-9 px-0"
              )}
            >
              <Icons.gitHub className="size-5" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
