import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { HeaderDescrip } from "~/components/header-descrip"
import { prisma } from "~/lib/db"

export const metadata: Metadata = {
  title: "Product",
  description: "Product description",
}

interface PrdouctPageProps {
  params: {
    productId: string
  }
}

export default async function ProductPage({ params }: PrdouctPageProps) {
  const { productId } = params

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      image: true,
    },
  })

  if (!product) {
    notFound()
  }

  return (
    <section className="container grid w-full items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <HeaderDescrip
          title={product.name}
          description={product.description ?? ""}
        />
      </div>
      <div className="relative mx-auto my-2 flex max-w-xl pt-[66.67%]">
        {product.image.map((image, i) => (
          <fieldset key={image.id}></fieldset>
        ))}
      </div>
    </section>
  )
}
