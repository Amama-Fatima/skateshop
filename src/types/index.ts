import { type USER_ROLE } from "@prisma/client"
import type { LucideIcon } from "lucide-react"
import type {
  DropzoneInputProps,
  DropzoneRootProps,
  FileWithPath,
} from "react-dropzone"

export type SessionUser = {
  id: string
} & {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: USER_ROLE | null
  active?: boolean | null
  seller?: boolean | null
}
//SessionUser is the user using a particular session. Rememeber in auth.ts, we added the id property to the session interface of the next-auth module. We also made sure that the session callback will have an id property. So, we are saying that SessionUser is an object with an id property and other properties from the session.user object.

export interface NavItem {
  title: string
  href?: string
  icon?: LucideIcon
  disabled?: boolean
  external?: boolean
}

export interface FileWithPreview extends File {
  preview: string
}

export type FullFileWithPreview = {
  file: FileWithPath
  preview: string
  content: string
}

export type FullFile = {
  file: FileWithPath
  content: string
}

export type UploadThingProps = {
  readonly getRootProps: <T extends DropzoneRootProps>(
    props?: T | undefined
  ) => T
  readonly getInputProps: <T_1 extends DropzoneInputProps>(
    props?: T_1 | undefined
  ) => T_1
  readonly isDragActive: boolean
  readonly files: FullFile[]
  readonly resetFiles: () => void
  readonly startUpload: () => Promise<any>
}
