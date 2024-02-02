import { type Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { HeaderDescrip } from "~/components/header-descrip"
import { Icons } from "~/components/icons"
import { authOptions } from "~/lib/auth"
import { prisma } from "~/lib/db"
import { getCurrentUser } from "~/lib/session"
import { type SessionUser } from "~/types"

export const metadata: Metadata = {
  title: "Stores",
  description: "Manage your stores.",
}

export default async function StoresPage() {
  const user: SessionUser | undefined = await getCurrentUser()

  if (!user) {
    //TODO Understand this
    return redirect(authOptions.pages?.signIn || "/login")
  }

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
  // console.log("Stores", stores)

  //container grid items-center gap-6 space-y-5 pb-20 pt-6 md:py-10
  return (
    <section className="container grid w-full items-center space-y-12 pb-20 pt-6 md:py-10">
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
        <Link href="/account/stores/add" className="w-fit">
          <div className="flex aspect-video h-40 flex-col rounded-md border p-5 shadow-md hover:bg-muted">
            <div className="flex items-center space-x-2">
              <Icons.add className="size-5 text-muted-foreground" />
              <h2 className="line-clamp-1 flex-1 text-lg font-bold">
                Create a new store
              </h2>
            </div>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              Create a new store to start selling your products.
            </p>
            <span className="sr-only">Create a new store</span>
          </div>
        </Link>
      )}
    </section>
  )
}
