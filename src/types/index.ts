export type SessionUser = {
    id: string;
} & {
    name?: string | null;
    email?: string | null;
    image?: string | null;
}
//SessionUser is the user using a particular session. Rememeber in auth.ts, we added the id property to the session interface of the next-auth module. We also made sure that the session callback will have an id property. So, we are saying that SessionUser is an object with an id property and other properties from the session.user object.