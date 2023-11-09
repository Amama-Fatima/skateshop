import {type GetServerSidePropsContext} from 'next'
import {
    getServerSession,
    type NextAuthOptions,
    type DefaultSession
} from 'next-auth'

import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import { env } from '~/env.mjs'
import { prisma } from './db'


 
//configuring the authentication logic using nextauth.js
//MODULE AUGMENTATION: a ts feature that allows you to extend the types of a module without modifying the module itself
//In this case session interface is being augmented to include custom property id. This means whenever, session is used, it will have an id property


declare module "next-auth"{
    //we are augmenting the session interface from the next-auth module
    interface Session extends DefaultSession{
        user: {
            id: string;
            //...other properties

        } & DefaultSession["user"];
        //adds a new id property to the user object in session. We are saying, in addition to all the properties from DefaultSession["user"], add id property of type string
    }
}



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
    },
        adapter: PrismaAdapter(prisma),


        providers: [
            GoogleProvider({
                clientId: env.GOOGLE_CLIENT_ID,
                clientSecret: env.GOOGLE_CLIENT_SECRET
            }),
        ]
    
}

//getServerAuthSession func is a wrapper around GetServerSidePropsContext
export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) =>{
    return getServerSession(ctx.req, ctx.res,authOptions)
}

//the func takes in an obj ctz with 2 properties req and res. These are the request and response objects of type GetServerSidePropsContext['req']'
//the func returns a promise of type session. This is the session object that is returned by getServerSession func.
//getServerSession takes a req obj, a res obj and auth options obj to  create or get a session for the current user. 
//it returns a promise with the session data, which can then be used to determine if the user's authenticated and to get the user's session info.