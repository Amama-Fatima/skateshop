"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { Product } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { Icons } from "~/components/icons"
import { Button } from "~/components/ui/button"
import {
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import { cn, formatEnum } from "~/lib/utils"
import type { ProductsByCategory } from "~/types"
import { CommandEmpty } from "cmdk"

import { DebounceCommandInput } from "./debounced-command-input"
import { Skeleton } from "./ui/skeleton"

export function Combobox() {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["filterProducts", query],
    queryFn: async () => {
      const response = await fetch("api/products/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      const data = (await response.json()) as ProductsByCategory<
        Pick<Product, "id" | "name">
      >[]
      return data
    },
    enabled: query.length > 0,
    refetchOnWindowFocus: false,
  })

  // console.log(data, isFetching)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((isOpen) => !isOpen)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  React.useEffect(() => {
    if (!isOpen) {
      setQuery("")
    }
  }, [isOpen])

  const handleSelect = React.useCallback((callback: () => unknown) => {
    setIsOpen(false)
    callback()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative size-9 justify-start md:h-10 md:w-60 md:px-3 md:py-2"
        onClick={() => setIsOpen(true)}
      >
        <Icons.search className="mr-2 size-4" aria-hidden="true" />
        <span className="hidden md:inline-flex">Search products...</span>
        <span className="sr-only">Search products</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <DebounceCommandInput
          placeholder="Search products..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty
            className={cn(isFetching ? "hidden" : "py-6 text-center text-sm")}
          >
            No products found.
          </CommandEmpty>
          {isFetching ? (
            <div className="space-y-1 overflow-hidden p-1">
              <Skeleton className="h-4 w-10 rounded" />
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
            </div>
          ) : (
            isSuccess &&
            data &&
            data.map((group, i) => (
              <CommandGroup key={i} heading={group.category}>
                {group.products &&
                  group.products.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() =>
                        handleSelect(() => router.push(`/products/${item.id}`))
                      }
                    >
                      {item.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
