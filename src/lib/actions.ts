"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "~/lib/db"
import { addProductSchema } from "~/lib/validations/product"
import { addStoreSchema } from "~/lib/validations/store"
import { zact } from "zact/server"
import { z } from "zod"

export const addStoreAction = zact(
  z.object({
    ...addStoreSchema.shape,
    userId: z.string(),
  })
)(async (input) => {
  const storeWithSameName = await prisma.store.findFirst({
    where: {
      name: input.name,
    },
  })

  if (storeWithSameName) {
    throw new Error("Store with same name already exists")
  }

  await prisma.store.create({
    data: {
      name: input.name,
      description: input.description,
      user: {
        connect: {
          id: input.userId,
        },
      },
    },
  })

  const path = "/account/stores"
  revalidatePath(path)
})

export const addProductAction = zact(
  z.object({
    ...addProductSchema.omit({ image: true }).shape,
    storeId: z.string(),
    images: z.array(z.string()),
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
      store: {
        connect: {
          id: input.storeId,
        },
      },
    },
  })
})
