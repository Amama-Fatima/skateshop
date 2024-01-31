import React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { type User } from "@prisma/client"
import { HeaderDescrip } from "~/components/header-descrip"
import { Icons } from "~/components/icons"
import { Skeleton } from "~/components/ui/skeleton"
import { prisma } from "~/lib/db"

const page = async () => {
  const user: User | null = await prisma.user.findUnique({
    where: {
      id: "1",
    },
  })

  console.log("User", user)

  const stores = await prisma.store.findMany({
    where: {
      userId: user?.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      products: {
        select: {
          id: true,
        },
      },
    },
  })

  console.log("Stores", stores)

  return (
    <section>
      <HeaderDescrip
        title="Your Stores"
        description="You can create up to 3 stores. Each store can have up to 100 products."
      />
      {stores?.length > 0 ? (
        <div>
          {stores.map((store) => (
            <Link key={store.id} href={`/account/stores/${store.id}`}>
              <div className="flex h-40 flex-col rounded-md border p-5 shadow-md hover:bg-muted">
                <div className="flex items-center space-x-2">
                  <Icons.store className="size-5 text-muted-foreground" />
                  <h2 className="line-clamp-1 flex-1 text-lg font-bold">
                    {store.name}
                  </h2>
                </div>
                <p className=" mt-2 text-sm text-muted-foreground">
                  {store.description}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {store.products.length} products
                </p>
              </div>
            </Link>
          ))}
          {stores.length < 3 && (
            <Link href="/account/stores/add">
              <div className="flex h-40 flex-col rounded-md border p-5 shadow-md hover:bg-muted">
                <div className="flex items-center space-x-2">
                  <Icons.add className="size-5 text-muted-foreground" />
                  <h2 className="line-clamp-1 flex-1 text-lg font-bold">
                    Create a new store
                  </h2>
                </div>
                <p className="mt-2 flex-1 text-sm text-muted-foreground sm:text-base">
                  You can create up to 3 stores
                </p>
              </div>
            </Link>
          )}
        </div>
      ) : (
        <div>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40" />
          ))}
        </div>
      )}
    </section>
  )
}

export default page
