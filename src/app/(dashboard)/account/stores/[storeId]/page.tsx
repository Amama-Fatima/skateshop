import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { HeaderDescrip } from "~/components/header-descrip"
import { Products } from "~/components/products"
import { prisma } from "~/lib/db"

export const metadata: Metadata = {
  title: "Manage Store",
  description: "Manage your store and products",
}

interface EditStorePageProps {
  params: {
    storeId: string
  }
}
export default async function EditStorePage({ params }: EditStorePageProps) {
  const storeId = params.storeId

  const store = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      id: true,
      name: true,
      products: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!store) {
    return notFound()
  }

  return (
    <section className="container grid w-full items-center space-y-12 pb-8 pt-6 md:py-10">
      <HeaderDescrip
        title={store.name}
        description="Manage your store and products"
      />
      <Products storeId={storeId} />
    </section>
  )
}

//this method of getting query params works in server side rendering
// for cliemt side, you can use useSearchParams() hook
