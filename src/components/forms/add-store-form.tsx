"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { addStoreAction } from "~/lib/actions"
import { addStoreSchema } from "~/lib/validations/store"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useZact } from "zact/client"
import { type z } from "zod"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

interface AddStoreFormProps {
  userId: string
}

type Inputs = z.infer<typeof addStoreSchema>

export function AddStoreForm({ userId }: AddStoreFormProps) {
  console.log(userId)

  const router = useRouter()
  const { mutate, isLoading } = useZact(addStoreAction)

  const { register, handleSubmit, formState, reset } = useForm<Inputs>({
    resolver: zodResolver(addStoreSchema),
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    reset()

    await mutate({
      ...data,
      userId,
    })

    router.push("/account/stores")
    router.refresh()
  }

  return (
    <form
      onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
      className="grid w-full gap-5"
    >
      <fieldset className="grid gap-2.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Type store name here..."
          {...register("name", { required: true })}
          disabled={isLoading}
        />
        {formState.errors.name && (
          <p className="text-sm text-red-500 dark:text-red-500">
            {formState.errors.name.message}
          </p>
        )}
      </fieldset>
      <fieldset className="grid gap-2.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Type store description here..."
          {...register("description", { required: true })}
          disabled={isLoading}
        />
        {formState.errors.description && (
          <p className="text-sm text-red-500 dark:text-red-500">
            {formState.errors.description.message}
          </p>
        )}
      </fieldset>
      <Button type="submit" disabled={isLoading}>
        {isLoading && (
          <Icons.spinner
            className="mr-2 size-4 animate-spin"
            aria-hidden="true"
          />
        )}
        Add Store
      </Button>
    </form>
  )
}
