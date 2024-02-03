import * as React from "react"
import Image from "next/image"
import { OurFileRouter } from "~/app/api/uploadthing/core"
import { Icons } from "~/components/icons"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog"
import { cn } from "~/lib/utils"
import { type FileWithPreview } from "~/types"
import { UploadCloud } from "lucide-react"
// import { generateReactHelpers } from "@uploadthing/react"
import {
  useDropzone,
  type Accept,
  type ErrorCode,
  type FileRejection,
} from "react-dropzone"
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form"
import { toast } from "react-hot-toast"

export interface FileDialogProps<TFieldValues extends FieldValues>
  extends React.HTMLAttributes<HTMLDivElement> {
  setValue: UseFormSetValue<TFieldValues>
  name: Path<TFieldValues>
  accept?: Accept
  maxSize?: number
  maxFiles?: number
  isUploading?: boolean
  disabled?: boolean
}

// const {useUploadThing} = generateReactHelpers<OurFileRouter>()

export function FileDialog<TFieldValues extends FieldValues>({
  name,
  setValue,
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
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setFiles((prev) => [
        ...(prev ?? []),
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ])

      acceptedFiles.forEach((file) => {
        if (!file) return
        setValue(name, file as PathValue<TFieldValues, Path<TFieldValues>>, {
          shouldValidate: true,
        })
      })
      rejectedFiles.forEach((file) => {
        setValue(name, null as PathValue<TFieldValues, Path<TFieldValues>>, {
          shouldValidate: true,
        })
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
    [maxSize, name, setValue]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
  })

  //revoke object urls when component unmounts
  React.useEffect(() => {
    if (!files) return
    files.forEach((file) => {
      URL.revokeObjectURL(file.preview)
    })
  }, [files])

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
            "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isDragActive && "border-muted-foreground/50",
            disabled && "pointer-events-none opacity-60",
            className
          )}
          {...props}
        >
          <input {...getInputProps()} />
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
          ) : (
            //  className="grid place-items-center gap-1 sm:px-5"
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
        {files && (
          <div className="mt-2 grid gap-5">
            {files.map((file, i) => (
              <div
                key={i}
                className="relative flex items-center justify-between gap-2.5"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={`/${file.name}`}
                    alt={file.name}
                    className="size-10 shrink-0 rounded-md"
                    width={40}
                    height={40}
                    loading="lazy"
                  />
                  <div className="flex flex-col">
                    <p className="line-clamp-1 text-sm font-medium text-muted-foreground">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {Math.round(file.size / 1024)}KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="size-7 p-0"
                  onClick={() => {
                    setFiles((prev) => {
                      if (!prev) return null
                      const newFiles = prev.filter(
                        (prevFile) => prevFile.name !== file.name
                      )
                      if (newFiles.length === 0) return null
                      return newFiles
                    })
                    setValue(
                      name,
                      null as PathValue<TFieldValues, Path<TFieldValues>>,
                      {
                        shouldValidate: true,
                      }
                    )
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
