// import { withContentlayer } from "next-contentlayer"

// /**
//  * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
//  * for Docker builds.
//  */
// await import("./src/env.mjs")

// /** @type {import("next").NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ["uploadthing.com", "utfs.io"],
//   },
//   /** Linting and typechecking are already done as separate tasks in the CI pipeline */
//   // eslint: {
//   //   ignoreDuringBuilds: true,
//   // },
//   // typescript: {
//   //   ignoreBuildErrors: true,
//   // },
// }
// export default withContentlayer(nextConfig)

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs")

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
    remotePatterns: [{ hostname: "*" }],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
}
export default config
