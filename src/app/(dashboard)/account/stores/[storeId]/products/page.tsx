import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { HeaderDescrip } from "~/components/header-descrip"
import { Icons } from "~/components/icons"
import { Products } from "~/components/products"
import { buttonVariants } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import { authOptions } from "~/lib/auth"
import { prisma } from "~/lib/db"
import { getCurrentUser } from "~/lib/session"
import { cn } from "~/lib/utils"

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your products.",
}

interface ProductsPageProps {
  params: {
    storeId: string
  }
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { storeId } = params

  const store = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (!store) {
    notFound()
  }

  return (
    <section className="container grid w-full items-center gap-6 space-y-5 pb-20 pt-6 md:py-10">
      <HeaderDescrip title={store.name} description="Manage your products." />
      <div className="flex items-center gap-2.5">
        <Link href={`/account/stores/${storeId}`}>
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "outline",
              })
            )}
          >
            <Icons.store className="mr-2 size-4" />
            Manage Store
            <span className="sr-only">Manage Store</span>
          </div>
        </Link>
        <Link href={`account/stores/${storeId}/products`}>
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "secondary",
              })
            )}
          >
            <Icons.product className="mr-2 size-4" />
            Manage Products
            <span className="sr-only">Manage Products</span>
          </div>
        </Link>
      </div>
      <Products storeId={storeId} />
    </section>
  )
}
