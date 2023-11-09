import NextAuth from "next-auth";
import { authOptions } from "~/lib/auth";

export default NextAuth(authOptions);

// Path: src/pages/api/auth/%5B...nextauth%5D.ts

//the path has meaning:
// [nextauth] makes it dynamic. /api/auth/aomthing will be handled by this file
// [nextauth].ts is the file that will handle the request
// but [...nextauth] is even more helpful. ... makes it catch-all. This feature in next js allows a single api route or page to handle all requests that match a certain pattern
// so /api/auth/anything will be handled by this file
// /api/auth/anything/else will also be handled by this file
// when request is made to the URL which matches /api/auth/sth, next js will look for a file that matches [...nextauth].ts. And run this code.
// The catch-all route [...nextauth].ts is designed to handle any request that starts with /api/auth/. So, if a request is made to /api/auth/something, Next.js identifies this file as the appropriate handler for that request.
// 
// 
// 
// 
// 
