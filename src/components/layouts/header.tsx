"use client"

import React from "react"
import Link from "next/link"
import { Icons } from "~/components/icons"
import MainNav from "~/components/layouts/main-nav"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { siteConfig } from "~/config/site"
import { type SessionUser } from "~/types"
import { signIn, signOut } from "next-auth/react"

import { Combobox } from "../combobox"

interface SiteHeaderProps {
  user: Pick<SessionUser, "name" | "image" | "email">
}

export default function Header({ user }: SiteHeaderProps): JSX.Element {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.MainNav} />
        <div>
          <nav className="flex flex-1 items-center space-x-1">
            <Combobox />
            <Button
              variant="ghost"
              size="sm"
              aria-label="cart"
              className="w-9 px-0"
            >
              <Icons.cart className="size-6" />
            </Button>
            {user.name && user.image && user.email ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="h-auto rounded-full p-0"
                    variant="ghost"
                    size="sm"
                    aria-label="Use menu trigger"
                  >
                    <Avatar className="size-8">
                      <AvatarImage src={user.image} />

                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.name && <p className="font-medium">{user.name}</p>}
                      {user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/stores">
                      <Icons.store className="mr-2 size-4" /> Stores
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/settings">
                      <Icons.settings className="mr-2 size-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    aria-label="Sign out"
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault()
                      //void keyword explicitly ignores any return values
                      void signOut()
                    }}
                  >
                    <Link href="/logout">
                      <Icons.logout className="mr-2 size-4" /> Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                aria-label="Sign in"
                size="sm"
                onClick={() =>
                  void signIn("credentials", {
                    // redirect: false,
                  })
                }
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
