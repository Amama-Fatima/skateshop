import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getCurrentUser } from "~/lib/session";
const f = createUploadthing();
 
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({req}) => {
      // This code runs on your server before upload
        //get the product id from the request
        const {productId} = (await req.json()) as {productId: string};
        console.log({req})

        const user = await getCurrentUser();
 
      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");
      if (!productId) throw new Error("Product not found");
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { productId };
    })
    .onUploadComplete(({ metadata}) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.productId)
 
      //Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;

//TODO: understand satisfies, understand the http request coming here, understand middleware