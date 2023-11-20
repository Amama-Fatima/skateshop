import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url(),
      // .refine(
      //   (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
      //   "You forgot to change the default URL"
      // ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
        // if we are not in production, it is necessary to set this secret for security reasons
    NEXTAUTH_URL: z.preprocess(
      (str)=> process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    
    //z.preprocess is a function which transforms data before it is validated. It akes 2 args. A transform function that takes ithe input data and returns the transformed data. 
    // the 2nd arg is the schema to which the transformed data will be validated against.
    //Here, the logic inside the preprocess makes deployment on vercel not fail if we dont set a NEXTAUTH_URL cuz next js will automatically use the VERCEL URL if present.
    // what it says is this: the 1st arg takes in a str which would be the value of NEXTAUTH_URL if VERCEL_URL is not set. If vercel_URL is set, the NEXTAUTH_URL is that.
    // then after transforming the data, the validation is done like this: VERCEL is a boolean flag indicating whether the app is deployed on vercel or not. If it is, then only make sure that the URL is a string of min length 1. If VERCEL is not true, then the URL must be the str passed which should actually be a valid url . We did not validate the VERCEL_URL as a url since vercel's env variables donot include protocol https, so validating it as a url will generate an error.

    // GOOGLE_CLIENT_ID: z.string(),
    // GOOGLE_CLIENT_SECRET: z.string(),

  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    // GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  // skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  // emptyStringAsUndefined: true,
});
