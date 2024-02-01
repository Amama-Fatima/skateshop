//this file handles the server side generation of open graph images

import type { ServerRuntime } from "next"
import { ImageResponse } from "next/dist/compiled/@vercel/og"
import { ogImageSchema } from "~/lib/validations/og"

export const runtime: ServerRuntime = "edge"
//ServerRuntime is a type that tells Next.js that this file should be run on the server side
//edge means that this file should be run on the edge server which is a type of server that is closer to the user geographically
export function GET(req: Request) {
  try {
    const url = new URL(req.url)
    //url.searchParams return an object of the type URLSearchParams which is an iterable object. Each iteration returns a key-value pair representing a single query parameter
    //Object.fromEntries() takes an iterable object and returns an object whose properties are the key-value pairs of the iterable object
    const parsedValues = ogImageSchema.parse(
      Object.fromEntries(url.searchParams)
    )
    const { mode, title, description } = parsedValues
    const paint = mode === "dark" ? "#fff" : "#000"

    return new ImageResponse(
      (
        <div
          tw="h-full w-full flex items-center justify-center flex-col"
          style={{
            color: paint,
            background:
              mode === "dark"
                ? "linear-gradient(90deg, #000 0%, #111 100%)"
                : "white",
          }}
        >
          <div tw="flex items-center text-3xl justify-center flex-col">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="124"
              height="124"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"
              />
            </svg>
          </div>
          <div
            tw="flex max-w-4xl items-center justify-center flex-col mt-10"
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            <div tw="text-5xl font-bold tracking-tight leading-tight dark:text-white px-8">
              {title}
            </div>
            <div tw="mt-5 text-3xl text-slate-400 text-center font-normal tracking-tight leading-tight px-20">
              {description}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    error instanceof Error
      ? console.log(`${error.message}`)
      : console.log(error)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}

// When we say "a client makes a request to a route," it can mean either of the scenarios you've described, depending on the context. Let's break down both situations:

// Client Directly Accessing the URL:

// In this scenario, when we say a client (like a browser) makes a request to a URL (e.g., https://yourdomain.com/abc/xyz/pqr), it typically means the user has directly navigated to that URL. This can happen in several ways:
// Typing the URL directly into the browser's address bar.
// Clicking a link that leads to that URL.
// Being redirected to that URL from another page.
// In this case, the entire page located at that URL is loaded. If it's a Next.js application, the server-side code for that specific page (like server-side rendering functions) will execute.
// Client Making an Asynchronous Request to the URL:

// In modern web applications, it's common to make asynchronous requests (often called AJAX requests) to specific URLs to fetch or send data without reloading the entire page. This is typically done using JavaScript.
// For example, when a user clicks a button on a webpage, it might trigger JavaScript code that makes a request to https://yourdomain.com/abc/xyz/pqr. This doesn't change the browser's URL or reload the page; instead, it fetches data from that URL and can update the current page dynamically.
// This kind of request is often used in single-page applications (SPAs) and is a key part of the functionality provided by JavaScript frameworks and libraries like React (which Next.js is based on).
// In the context of your Next.js application and the specific route for generating OG images (https://yourdomain.com/api/og/route?param1=value1&param2=value2), it's more likely to be the second scenario. This route seems designed to handle AJAX requests where the client (a web page's JavaScript code) requests this URL to generate an OG image based on provided parameters. The user's browser wouldn't navigate to this URL directly; instead, the web page's code would make a request to this URL to retrieve the generated image, possibly for dynamically updating a part of the web page or for other purposes like sharing on social media.
