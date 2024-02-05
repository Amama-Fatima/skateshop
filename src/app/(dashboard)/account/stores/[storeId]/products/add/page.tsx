import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { AddProductForm } from "~/components/forms/add-product-form"
import { HeaderDescrip } from "~/components/header-descrip"
import { authOptions } from "~/lib/auth"
import { prisma } from "~/lib/db"
import { getCurrentUser } from "~/lib/session"

export const metadata: Metadata = {
  title: "Add Product",
  description: "Add a new product.",
}

interface AddStorePageProps {
  params: {
    storeId: string
  }
}

export default async function AddStorePage({ params }: AddStorePageProps) {
  const { storeId } = params
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions.pages?.signIn || "/api/auth/signin")
  }

  const store = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      id: true,
    },
  })

  if (!store) {
    notFound()
  }

  return (
    <section className="container grid w-full items-center gap-10 pb-10 pt-6 md:py-10">
      <HeaderDescrip title="Add Product" description="Add a new product." />
      <AddProductForm storeId={storeId} />
    </section>
  )
}
