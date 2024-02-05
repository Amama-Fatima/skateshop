import * as React from "react"
import Image from "next/image"
import { Icons } from "~/components/icons"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog"
import { cn } from "~/lib/utils"
import { useImageStore } from "~/stores/images"
import {
  useDropzone,
  type Accept,
  type ErrorCode,
  type FileRejection,
} from "react-dropzone"
import type { FieldValues } from "react-hook-form"
import { toast } from "react-hot-toast"

export interface FileDialogProps<TFieldValues extends FieldValues>
  extends React.HTMLAttributes<HTMLDivElement> {
  // setValue: UseFormSetValue<TFieldValues>
  // name: Path<TFieldValues>
  accept?: Accept
  maxSize?: number
  maxFiles?: number
  isUploading?: boolean
  disabled?: boolean
}

export function FileDialog<TFieldValues extends FieldValues>({
  // name,
  // setValue,
  accept = {
    "image/*": [],
  },
  maxSize = 1024 * 1024 * 2,
  maxFiles = 1,
  isUploading = false,
  disabled = false,
  className,
  ...props
}: FileDialogProps<TFieldValues>) {
  const [isDisabled, setIsDisabled] = React.useState(disabled ?? false)
  const { images, addImage, removeImage } = useImageStore()

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      console.log("ondrop")

      acceptedFiles.forEach((file) => {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
        addImage(fileWithPreview)
      })

      acceptedFiles.forEach((file) => {
        if (!file) {
          return
        }
        // setValue(name, file as PathValue<TFieldValues, Path<TFieldValues>>, {
        //   shouldValidate: true,
        // })
      })

      rejectedFiles.forEach((file) => {
        // setValue(name, null as PathValue<TFieldValues, Path<TFieldValues>>, {
        //   shouldValidate: true,
        // })

        switch (file.errors[0]?.code as ErrorCode) {
          case "file-invalid-type":
            toast.error("File type not supported")
            break
          case "file-too-large":
            const size = (file.file.size / 1024 / 1024).toFixed(2)
            toast.error(
              `Please select a file smaller than ${
                maxSize / 1024 / 1024
              }MB. Current size: ${size}MB`
            )
            break
          case "too-many-files":
            toast.error("Please select only one file")
            break
          default:
            toast.error(file.errors[0]?.message ?? "Error uploading file")
            break
        }
      })
    },
    [maxSize, images]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
  })

  //revoke object urls when component unmounts
  React.useEffect(() => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.preview)
    })
  }, [images])

  //disable when maxfiles reached
  React.useEffect(() => {
    if (images && images.length >= maxFiles) {
      setIsDisabled(true)
    }
  }, [images?.length, maxFiles])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Upload Images
          <span className="sr-only">Upload Images</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <div
          {...getRootProps()}
          className={cn(
            "group relative grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isDragActive && "border-muted-foreground/50",
            isDisabled && "pointer-events-none opacity-60",
            className
          )}
          {...props}
        >
          <input
            {...getInputProps()}
            className="absolute inset-0 z-10 size-full overflow-hidden opacity-0"
            style={{
              display: "block",
            }}
          />
          {isUploading ? (
            <div className="group grid w-full place-items-center gap-1 sm:px-10">
              <Icons.upload
                className="size-9 animate-pulse text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          ) : isDragActive ? (
            <div className="grid place-items-center gap-2 text-muted-foreground sm:px-5">
              <Icons.upload
                className={cn("size-9", isDragActive && "animate-bounce")}
                aria-hidden="true"
              />
              <p className="text-base font-medium">Drop files here</p>
            </div>
          ) : isDisabled ? (
            <div className="grid place-items-center gap-1 sm:px-5">
              <Icons.warning
                className="size-9 text-destructive"
                aria-hidden="true"
              />
              <p className="mt-2 text-base font-medium text-muted-foreground">
                You have reached the maximum number of files
              </p>
              <p className="text-sm text-slate-500">
                Please remove some files to upload more
              </p>
            </div>
          ) : (
            <div className="grid place-items-center gap-1 sm:px-5">
              <Icons.upload
                className="size-9 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="mt-2 text-base font-medium text-muted-foreground">
                Drag {`'n'`} drop file here, or click to select file
              </p>
              <p className="text-sm text-slate-500">
                Please upload file with size less than{" "}
                {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          )}
        </div>
        <p>
          You can upload up to {maxFiles} {maxFiles > 1 ? "files" : "file"}
        </p>
        {images && (
          <div className="mt-2 grid gap-5">
            {images.map((image, i) => (
              <div
                key={i}
                className="relative flex items-center justify-between gap-2.5"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={image.preview}
                    alt="preview"
                    className="size-10 shrink-0 rounded-md"
                    width={40}
                    height={40}
                    loading="lazy"
                    unoptimized={false}
                  />
                  <div className="flex flex-col">
                    <p className="line-clamp-1 text-sm font-medium text-muted-foreground">
                      {image.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {Math.round(image.size / 1024)}KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="size-7 p-0"
                  onClick={() => {
                    removeImage(i)
                    // setValue(
                    //   name,
                    //   null as PathValue<TFieldValues, Path<TFieldValues>>,
                    //   {
                    //     shouldValidate: true,
                    //   }
                    // )
                  }}
                >
                  <Icons.close
                    className="size-4 text-white"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
