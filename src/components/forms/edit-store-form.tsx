"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { PRODUCT_CATEGORY } from "@prisma/client"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"

import { Input } from "../ui/input"
import { Label } from "../ui/label"

interface EditStoreFormProps {
  storeId: string
}

const schema = z.object({
  name: z.string().min(1, {
    message: "Store name must be at least 1 character long",
  }),
  description: z.string().optional(),
  price: z.number().positive({
    message: "Price must be a positive number",
  }),
  images: z.array(z.string()).optional(),
  category: z.nativeEnum(PRODUCT_CATEGORY),
  quantity: z.number().positive({
    message: "Quantity must be a positive number",
  }),
  inventory: z.number().positive({
    message: "Inventory must be a positive number",
  }),
})

type Inputs = z.infer<typeof schema>

export function EditStoreForm({ storeId }: EditStoreFormProps) {
  console.log(storeId)

  const { register, handleSubmit, formState, setValue, reset } =
    useForm<Inputs>({
      resolver: zodResolver(schema),
    })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)

    //reset()
  }

  return (
    <form
      onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
      className="grid w-full gap-5"
    >
      <fieldset>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Name"
          {...register("name", { required: true })}
        />
      </fieldset>
      {formState.errors.name && (
        <p className="text-sm text-red-500 dark:text-red-500">
          {formState.errors.name.message}
        </p>
      )}
    </form>
  )
}
