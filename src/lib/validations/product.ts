import { PRODUCT_CATEGORY } from "@prisma/client"
import { z } from "zod"

export const getProductsSchema = z.object({
  storeId: z.string(),
  page: z.number().int().default(0),
  perPage: z.number().int().default(10),
})

export const addProductSchema = z.object({
  name: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  description: z.string().optional(),
  category: z.nativeEnum(PRODUCT_CATEGORY),
  price: z.number().positive({
    message: "Must be a positive number",
  }),
  quantity: z.number().positive({
    message: "Must be a positive number",
  }),
  inventory: z.number().positive({
    message: "Must be a positive number",
  }),
})

export const filterProductSchema = z.object({
  query: z.string(),
})
