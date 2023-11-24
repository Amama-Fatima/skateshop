//This file is configuring NextAuth.js for authentication in next js app
//NextAuthOptions is the type for the config obj that NextAuth.js accepts
// DefaultSession is a type representing the default session object provided by NextAuth.js

import {type GetServerSidePropsContext} from 'next'
import {
    getServerSession,
    type NextAuthOptions,
    type DefaultSession
} from 'next-auth'

// import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from '@next-auth/prisma-adapter'
//Prisma Adapter is used to connect NextAuth.js to Prisma. 
// import { env } from '~/env.mjs'
import { prisma } from './db'
//prisma is a configured instance of prisma client. It is used to connect to and interact with the database.

 
//configuring the authentication logic using nextauth.js
//MODULE AUGMENTATION: a ts feature that allows you to extend the types (add additional properties to a type) of a module without modifying the module itself
//In this case session interface is being augmented to include custom property id. This means whenever, session is used, it will have an id property


declare module "next-auth"{
    //we are augmenting the session interface from the next-auth module
    interface Session extends DefaultSession{
        user: {
            id: string;
            //...other properties

        } & DefaultSession["user"]; // way of refferring to  a subtype (user) inside a larger type (Defaultsession)    
        //adds a new id property to the user object in session. We are saying, in addition to all the properties from DefaultSession["user"], add id property of type string
    }
}



//NextAuthConfig and NextAuthOptions are essentially two sides of the same coin: NextAuthConfig is the actual configuration object, while NextAuthOptions is the TypeScript type that describes its structure.

//below is the configuration for next-auth
export const authOptions: NextAuthOptions = {
    //callbacks are functions which run during authentication flow
    callbacks: {
        //callback obj has a key session. This is a function that runs after a session is created. It takes in session and user as arguments and returns a session object
        session: ({session, user})=>({
            ...session,
            user: {
                ...session.user, // inside the user key of the returned session object, it spreads the session user but also adds id from user obj received as argument
                id: user.id
            },
        }),

        //The TypeScript declaration only tells TypeScript what type of data to expect.
        //The session callback in authOptions actually modifies the session object at runtime to include the database ID.
        //the actual structure of the session object at runtime is determined by NextAuth.js and how it interacts with your chosen database and authentication providers. By default, NextAuth.js does not include the user's database ID in the session object; it includes a minimal subset of user information for efficiency and to minimize the size of the session token that gets passed around.
        //To include additional information in the session object — such as the user's database ID — you need to explicitly tell NextAuth.js to do so. 

    },
        adapter: PrismaAdapter(prisma),

        providers: [
            // GoogleProvider({
            //     clientId: env.GOOGLE_CLIENT_ID as string,
            //     clientSecret: env.GOOGLE_CLIENT_SECRET as string
            // }),
        ]
    
}

//getServerAuthSession func is a wrapper around GetServerSidePropsContext
export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) =>{
    return getServerSession(ctx.req, ctx.res,authOptions)
}


//the func takes in an obj ctx with 2 properties req and res. These are the request and response objects of type GetServerSidePropsContext['req']'
//the func returns a promise of type session. This is the session object that is returned by getServerSession func.
//getServerSession takes a req obj, a res obj and auth options obj to  create or get a session for the current user. 
//it returns a promise with the session object, which can then be used to determine if the user's authenticated and to get the user's session info.