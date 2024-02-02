import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { EditProductForm } from "~/components/forms/edit-product-form"
import { HeaderDescrip } from "~/components/header-descrip"
import { prisma } from "~/lib/db"

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Edit your product.",
}

interface EditProductPageProps {
  params: {
    productId: string
  }
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { productId } = params

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      catergory: true,
      price: true,
      quantity: true,
      inventory: true,
    },
  })

  if (!product) {
    notFound()
  }

  return (
    <section className="container grid w-full items-center gap-10 pb-10 pt-6 md:py-10">
      <HeaderDescrip title="Edit Product" description="Edit your product." />
      <EditProductForm productId={product.id} />
    </section>
  )
}
