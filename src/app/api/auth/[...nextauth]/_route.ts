import { authOptions } from "~/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions) as unknown;
export {handler as GET, handler as POST}


//in web dev handler is a function that handles a request. Each handler is typically associated with a specific route




//[...nextauth] is a special syntax for folder names called catch-all routes
//[] means that it is a dynamic segment of the url
//... means that it will match any route that starts with /api/auth/ e.g /api/auth/signin or /api/auth/signin/xyz
//