'use client'

import React from 'react'
import MainNav from './main-nav'
import { ThemeToggle } from './theme-toggle'
import { siteConfig } from '~/config/site'
import type { SessionUser } from '~/types'
import { signOut } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { DropdownMenuContent } from './ui/dropdown-menu'
import Link from 'next/link'
import { Icons } from './icons'


interface SiteHeaderProps{
  user: Pick<SessionUser, "name" | "image" | "email">;
}

const SiteHeader = ({user}: SiteHeaderProps) => {
  const router = useRouter();
  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background'>
      <div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
        <MainNav items={siteConfig.mainNav} />
        <div>
          <nav className='flex flex-1 items-center space-x-1'>
            <ThemeToggle/>
            {user.name && user.image && user.email ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='h-auto rounded-full p-0' variant='ghost' size='sm' aria-label='Use menu trigger'>
                    <Avatar className='h-8 w-8'>
                    <AvatarImage src={user.image} />
    
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <div className='flex items-center justify-start gap-2 p-2'>
                    <div className='flex flex-col space-y-1 leading-none'>
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
                  <Link href='/chats'>
                    <Icons.message className="mr-2 h-4 w-4" /> Chats
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/settings'>
                    <Icons.settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild aria-label='Sign out' className='cursor-pointer'
                onSelect={(e)=>{
                  e.preventDefault();
                  //void keyword explicitly ignores any return values
                  void signOut({
                    callbackUrl: `${window.location.origin}/login` //redirect to baseurl/login
                  })
                }}
                >
                  <Link href='/logout'>
                    <Icons.logout className="mr-2 h-4 w-4" /> Logout
                  </Link>
                </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
             ) : ( 
               <Button
               aria-label="Sign in"
                size="sm"
                onClick={() => router.push("/login")}
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

export default SiteHeader