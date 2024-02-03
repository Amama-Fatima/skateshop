import { createNextRouteHandler } from "uploadthing/next"

import { ourFileRouter } from "./core"

// Export routes for Next App Router
export const { POST } = createNextRouteHandler({
  router: ourFileRouter,
})
