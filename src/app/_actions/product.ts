"use server"

import { revalidateTag } from "next/cache"
import { PRODUCT_CATEGORY } from "@prisma/client"
import { prisma } from "~/lib/db"
import { addProductSchema } from "~/lib/validations/product"
import { zact } from "zact/server"
import { z } from "zod"

export async function filterProductsAction(query: string) {
  if (typeof query !== "string") {
    throw new Error("Query must be a string")
  }

  if (query.length < 1) return []

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    select: {
      id: true,
      name: true,
      catergory: true,
    },
  })

  const productsByCategory = Object.values(PRODUCT_CATEGORY).map(
    (category) => ({
      category,
      products: products.filter((product) => product.catergory === category),
    })
  )

  return productsByCategory
}

export async function checkProductNameAction(fd: FormData) {
  const pName = fd.get("name") as string

  const productWithSameName = await prisma.product.findFirst({
    where: {
      name: pName,
    },
  })

  if (productWithSameName) {
    return {
      error: "Product with same name already exists",
    }
  }
}

export const addProductAction = zact(
  z.object({
    ...addProductSchema.shape,
    storeId: z.string(),
    image: z.array(
      z.object({
        id: z.string(),
        url: z.string(),
        name: z.string(),
      })
    ),
  })
)(async (input) => {
  const productWithSameName = await prisma.product.findFirst({
    where: {
      name: input.name,
    },
  })

  if (productWithSameName) {
    throw new Error("Product with same name already exists")
  }

  await prisma.product.create({
    data: {
      name: input.name,
      description: input.description,
      catergory: input.category,
      price: input.price,
      quantity: input.quantity,
      inventory: input.inventory,
      image: {
        createMany: {
          data: input.image,
        },
      },
      store: {
        connect: {
          id: input.storeId,
        },
      },
    },
  })
})

export async function deleteProductAction(ids: string[]) {
  if (!Array.isArray(ids)) throw new Error("Ids must be an array")

  await prisma.product.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  revalidateTag("products")
}
