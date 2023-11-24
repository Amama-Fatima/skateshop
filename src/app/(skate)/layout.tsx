import SiteFooter from "~/components/site-footer";
import SiteHeader from "~/components/site-header";
import { getCurrentUser } from "~/lib/session";

interface LofiLayoutProps{
    children: React.ReactNode;
}

export default async function LofiLayout({children}: LofiLayoutProps){

    const user = await getCurrentUser();

    return(
        <div>
            <SiteHeader user={{
                name: user?.name,
                image: user?.image,
                email: user?.email
            
            }}/>
            <main>{children}</main>
            <SiteFooter/>
        </div>
    )
}