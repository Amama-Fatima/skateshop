import { getCurrentUser } from "~/lib/session"
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  productImage: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      //get the product id from the request
      // const {productId} = (await req.json()) as {productId: string};
      console.log({ req })

      const user = await getCurrentUser()
      console.log(user)

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized")

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { user }
    })
    .onUploadComplete(({ metadata }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.user)

      //Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

//TODO: understand satisfies, understand the http request coming here, understand middleware
