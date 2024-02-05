"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { PRODUCT_CATEGORY } from "@prisma/client"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { type OurFileRouter } from "~/app/api/uploadthing/core"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { addProductAction } from "~/lib/actions/product"
import { addProductSchema } from "~/lib/validations/product"
import { useImageStore } from "~/stores/images"
import { type UploadThingOuput } from "~/types"
import { useForm, type SubmitHandler } from "react-hook-form"
import toast from "react-hot-toast"
import { useZact } from "zact/client"
import { type z } from "zod"

import { FileDialog } from "../file-dialog"
import { Icons } from "../icons"
import SelectInput from "../select-input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

interface AddProductFormProps {
  storeId: string
}

type Inputs = z.infer<typeof addProductSchema>

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function AddProductForm({ storeId }: AddProductFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const { images, clearImages } = useImageStore()

  // react-hook-form
  const addProductMutation = useZact(addProductAction)
  const { register, handleSubmit, formState, control, reset } = useForm<Inputs>(
    {
      resolver: zodResolver(addProductSchema),
    }
  )

  const { startUpload } = useUploadThing("productImage", {
    onClientUploadComplete: () => {
      alert("uploaded successfully")
    },
    onUploadError: (error: Error) => {
      alert("upload failed " + error.message)
    },
    onUploadBegin: () => {
      alert("upload started")
    },
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("data", data)
    setIsLoading(true)
    const rawImages = (await startUpload(images)) as UploadThingOuput[]

    const databaseReadyImages = rawImages.map((image) => ({
      id: image.key,
      name: image.name,
      url: image.url,
    }))

    setIsLoading(addProductMutation.isLoading)

    await addProductMutation.mutate({
      storeId,
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      quantity: data.quantity,
      inventory: data.inventory,
      image: databaseReadyImages,
    })

    addProductMutation.error
      ? toast.error(addProductMutation.error.message)
      : toast.success("Product added successfully")

    setIsLoading(false)

    reset()
    clearImages()
  }

  return (
    <form
      className="mx-auto grid w-full max-w-xl gap-6"
      onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
    >
      <fieldset className="grid gap-2.5">
        <Label htmlFor="add-product-name">Name</Label>
        <Input
          id="add-product-name"
          type="text"
          placeholder="Type product name here."
          {...register("name", { required: true })}
          // disabled={isLoading}
        />
        {formState.errors.name && (
          <p className="text-sm text-red-500 dark:text-red-500">
            {formState.errors.name.message}
          </p>
        )}
      </fieldset>
      <fieldset className="grid gap-2.5">
        <Label htmlFor="add-product-description">Description</Label>
        <Textarea
          id="add-product-description"
          placeholder="Type product description here."
          {...register("description", { required: true })}
          // disabled={isLoading}
        />
        {formState.errors.description && (
          <p className="text-sm text-red-500 dark:text-red-500">
            {formState.errors.description.message}
          </p>
        )}
      </fieldset>
      <div className="flex flex-col items-start gap-2.5 sm:flex-row">
        <fieldset className="grid gap-2.5">
          <Label htmlFor="add-product-category">Category</Label>
          <SelectInput
            control={control}
            name="category"
            placeholder="Select a category"
            options={Object.values(PRODUCT_CATEGORY)}
          />
          {formState.errors.description && (
            <p className="text-sm text-red-500 dark:text-red-500">
              {formState.errors.description.message}
            </p>
          )}
        </fieldset>
        <fieldset className="grid gap-2.5">
          <Label htmlFor="add-product-price">Price</Label>
          <Input
            id="add-product-price"
            type="number"
            placeholder="Type product price here."
            {...register("price", { required: true, valueAsNumber: true })}
            // disabled={isLoading}
          />
          {formState.errors.price && (
            <p className="text-sm text-red-500 dark:text-red-500">
              {formState.errors.price.message}
            </p>
          )}
        </fieldset>
      </div>
      <div className="flex flex-col items-start gap-2.5 sm:flex-row">
        <fieldset className="grid w-full gap-2.5">
          <Label htmlFor="add-product-quantity">Quantity</Label>
          <Input
            id="add-product-quantity"
            type="number"
            placeholder="Type product quantity here."
            {...register("quantity", { required: true, valueAsNumber: true })}
            // disabled={isLoading}
          />
          {formState.errors.quantity && (
            <p className="text-sm text-red-500 dark:text-red-500">
              {formState.errors.quantity.message}
            </p>
          )}
        </fieldset>
        <fieldset className="grid w-full gap-2.5">
          <Label htmlFor="add-product-inventory">Inventory</Label>
          <Input
            id="add-product-inventory"
            type="number"
            placeholder="Type product inventory here."
            {...register("inventory", { required: true, valueAsNumber: true })}
            // disabled={isLoading}
          />
          {formState.errors.inventory && (
            <p className="text-sm text-red-500 dark:text-red-500">
              {formState.errors.inventory.message}
            </p>
          )}
        </fieldset>
      </div>
      <fieldset>
        <Label htmlFor="add-product-images">Images (optional)</Label>
        <FileDialog
          // setValue={setValue}
          // name="image"
          maxFiles={3}
          maxSize={1024 * 1024 * 8}
          disabled={isLoading}
        />
      </fieldset>
      <Button disabled={isLoading}>
        {isLoading && (
          <Icons.spinner
            className="mr-2 size-4 animate-spin"
            aria-hidden="true"
          />
        )}
        Add Product
        <span className="sr-only">Add Product</span>
      </Button>
    </form>
  )
}
