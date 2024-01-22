import * as React from "react";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
import {
  useDropzone,
  type Accept,
  type ErrorCode,
  type FileRejection,
} from "react-dropzone";

import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import { toast } from "react-hot-toast";
import { cn } from "~/lib/utils";



interface FileInputProps<TFieldValues extends FieldValues>
  extends React.HTMLAttributes<HTMLDivElement> {
    name: Path<TFieldValues>;
    setValue: UseFormSetValue<TFieldValues>;
    accept?: Accept;
    maxSize: number;
    maxFiles?: number;
    files: File[] | null;
    setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
    previewType?: "image" | "name";
    isUploading?: boolean;
    disabled?: boolean;
}



export function FileInput<TFieldValues extends FieldValues>({
    name,
    setValue,
    accept = {
      "image/png": [],
      "image/jpeg": [],
    },
    maxSize,
    maxFiles = 1,
    files,
    setFiles,
    previewType = "image",
    isUploading = false,
    disabled = false,
    className,
    ...props
  }: FileInputProps<TFieldValues>) {
    const onDrop = React.useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[])=>{
            setFiles(acceptedFiles)

            acceptedFiles.forEach((file)=>{
                if(!file) return
                setValue(
                    name,  //name of the field in the form
                    file as PathValue<TFieldValues, Path<TFieldValues>>, // the new value of the field
                    {
                        shouldValidate: true, // whether the input should be validated
                    }
                )
            })

            rejectedFiles.forEach((file)=>{
                setValue(name, null as PathValue<TFieldValues, Path<TFieldValues>>,
                    {
                        shouldValidate: true,
                    }
                )

                switch(file.errors[0]?.code){
                    case "file-invalid-type":
                        toast.error("Invalid file type")
                        break
                    case "file-too-large":
                        const size = (file.file.size / 1024 / 1024).toFixed(2)
                        toast.error(`File is too large (${size}MB). Max size is ${maxSize/1024/1024}MB`)
                        break
                    case "too-many-files":
                        toast.error(`Too many files. Max files is ${maxFiles}`)
                        break
                    default:
                        toast.error(file.errors[0]?.message ?? "Error uploading file")
                        break
                }
            })
        }, 
        [maxSize, name, setFiles, setValue]
    )


    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept,
        maxSize,
        maxFiles,
    })

    
    //revoke object URL when component unmounts
    React.useEffect(()=>{
        if(!files) return

        return ()=>{
            files.forEach((file)=> URL.revokeObjectURL(file.name))
        }

    }, [files])


    return(
        <div {...getRootProps()} 
        {...props}

        className={cn("group relative grid h-60 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition hover:bg-slate-200/25 dark:hover:bg-slate-700/25", 
                    "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
                    isDragActive ?
                    "border-slate-900 dark:border-slate-400" :
                    "border-slate-500",
                    files && previewType === "image" ? "h-full border-none p-0" : "h-60",
                    disabled ?
                    "opacity-60 pointer-events-none" :
                    "opacity-100 pointer-events-auto",
                    className
        )}
        >
            <input {...getInputProps()} />
            {isUploading ? (
                <div className="group grid w-full place-items-center gap-1 sm:px-10">
                    <UploadCloud className="w-10 h-10 text-slate-700 dark:text-slate-400 animate-pulse" 
                    aria-hidden="true"
                    />
                    <p className="line-clamp-2 text-sm text-slate-950 dark:text-slate-50">
                        {files? files[0]?.name : "Uploading..."}
                    </p>
                </div>
            ): files ?  (
                previewType === "image" ? (
                    <div className={cn(files.length > 1 ? "grid gap-2": "")}>
                        <div className="group relative aspect-square h-full max-h-[420px] w-full overflow-hidden rounded-lg">
                            {isDragActive ? (
                                <div className="absolute inset-0 grid h-full w-full place-items-center">
                                    <DragActive isDragActive={isDragActive} />
                                </div>
                            ): null}
                            <Image src={URL.createObjectURL(
                                files[files.length - 1] ?? new File([""], "preview", {type: "image/png"})
                            )}   
                            alt={files[files.length - 1]?.name ?? "preview"}
                            fill
                            loading="lazy"
                            className="absolute inset-0 -z-10 rounded-lg object-cover"
                            />
                        </div>
                        {files.length > 1 ? (
                            <div className="grid gap-2">
                                {files.map((file, i)=>(
                                    <p 
                                    key={i}
                                    className="line-clamp-3 teaxt-base font-medium text-slate-950 dark:text-slate-50 sm:text-lg"
                                    >
                                        {file.name}
                                    </p>
                                ))}
                            </div>
                        ):(null)}
                    </div>
                ) : (
                    <div>
                        <div className="w-full rounded-lg">
                            {isDragActive ? (
                                <DragActive isDragActive={isDragActive} />


                            ): maxFiles > 1 ? (<></>) :(
                                <p className="line-clamp-3 teaxt-base font-medium text-slate-950 dark:text-slate-50 sm:text-lg">
                                    {files[files.length-1]?.name}
                                </p>
                            )}
                            
                        </div>
                    </div>
                )
            )
        
            : (
                isDragActive ? (
                    <DragActive isDragActive={isDragActive} />
                ) : (
                    <div className="grid place-items-center gap-1 sm:px-10">
                        <UploadCloud className="w-10 h-10 text-slate-700 dark:text-slate-400" aria-hidden="true" />
                        <p className="text-base font-medium text-slate-950 dark:text-slate-50 sm:text-lg">
                            {maxFiles > 1 ? "Drop files here or click to browse" : "Drop file here or click to browse"}
                        </p>
                    </div>
                )
            )}
        </div>
    )
}

export default FileInput

const DragActive = ({isDragActive}: {isDragActive: boolean})=>{
    return (
        <div className="grid place-items-center gap-2 text-slate-700 dark:text-slate-400 sm:px-10">
            <UploadCloud
            className={cn("h-10 w-10", isDragActive ? "animate-bounce" : "")}
            aria-hidden="true"
            />
            <p className="text-base font-medium sm:text-lg">
                Drop files here
            </p>
        </div>
    )
}