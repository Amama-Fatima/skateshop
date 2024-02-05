import { type FileWithPreview } from "~/types"
import { create } from "zustand"

interface ImageStoreState {
  images: FileWithPreview[]
  addImage: (image: FileWithPreview) => void
  removeImage: (index: number) => void
  clearImages: () => void
}

export const useImageStore = create<ImageStoreState>((set) => ({
  images: [],
  addImage: (image) => set((state) => ({ images: [...state.images, image] })),
  removeImage: (index) =>
    set((state) => ({ images: state.images.filter((_, i) => i !== index) })),
  clearImages: () => set((state) => ({ images: [] })),
}))
