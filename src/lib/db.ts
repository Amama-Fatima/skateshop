import { PrismaClient } from "@prisma/client"
import { env } from "~/env.mjs"

//PrismaClient is a class

//setting up and exporting a prisma client instance that can be used throughout app
declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient
  //extending the global namespace to include a new variable cachedPrisma of type PrismaCLient
}

let prisma: PrismaClient

if (env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient()
  }

  prisma = global.cachedPrisma
}

export { prisma }

/**
 * reason for different logics of prisma client based on NODE_ENV
 * 
 * DEVELOPMENT ENVIRONMENT:
 * Hot Reloading: In development, your code often changes and the server may automatically restart to apply these changes. This is known as hot reloading. If a new prismaclient instance is created on every reload, this can quickly exhaust database connections cuz each instanse may maintain its own connection pool.
 * Single Instance: By caching the PrismaClient instance globally (i.e attaching it to the global object), you ensure that regardless how many times your server restarts, the same instance and connection pool is used. 
 * PRODUCTION ENVIRONMENT:
 * Stable Codebase: In production, the code base is stable and the server does not restart frequently so there is no need to cache prismaclient. 
 * Scalability: In production, each deployment or instance of your application should have its own PrismaClient to ensure that the connection pool is managed correctly. This is especially important in horizontally scaled applications where multiple instances of your application may be running simultaneously.
    Reliability: You want to ensure that each production instance has a fresh client to prevent any potential issues related to stale connections or state that could occur with a cached client. This fresh client ensures that your database connections are reset on each new deployment, maintaining the reliability of your application.
 * 
 */
