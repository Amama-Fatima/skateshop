import Header from "~/components/header";
import SiteFooter from "~/components/site-footer";
import { getCurrentUser } from "~/lib/session";

interface LofiLayoutProps{
    children: React.ReactNode;
}

export default async function LofiLayout({children}: LofiLayoutProps){

    // const user = await getCurrentUser();
    //make a random user object
    // const user = {
    //     name: 'John Doe',
    //     image: 'https://avatars.githubusercontent.com/u/56592201?v=4',
    //     email: 'john@doe'
    // }'
    const user= {
        name: "Chad",
        image: "https://pbs.twimg.com/profile_images/1364491704816005632/4iY6yMgX_400x400.jpg",
        email: "jjj"
    }

    return(
        <div>
            <Header 
            user={{
                name: user?.name,
                image: user?.image,
                email: user?.email
            
            }}
            />
            <main>{children}</main>
        </div>
    )
}