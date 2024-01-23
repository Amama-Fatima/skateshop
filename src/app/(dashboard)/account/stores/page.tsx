import { Metadata } from "next"
import Link from "next/link"
import { redirect} from "next/navigation"
import { Icons } from "~/components/icons"
import { HeaderDescrip } from "~/components/header-descrip"
import { Skeleton } from "~/components/ui/skeleton"
import { authOptions } from "~/lib/auth"
import { prisma } from "~/lib/db"
import { getCurrentUser } from "~/lib/session"

export const metadata: Metadata = {
    title: "Stores",
    description: "Manage your stores.",
}

export default async function StoresPage(){

    // const user = await getCurrentUser()
    const user = await prisma.user.findUnique({
        where:{
            id: "1"
        }
    })

    if(!user){
        //TODO Understand this
        return redirect(authOptions.pages?.signIn || "/login")
    }

    const stores = await prisma.store.findMany({
        where: {
            userId: user?.id,
        },
        select: {
            id: true,
            name: true,
            description: true,
            products: {
                select: {
                    id: true,
                },
            },
        }
    })

    //container grid items-center gap-6 space-y-5 pb-20 pt-6 md:py-10
    return(
        <section className="container grid w-full items-center gap-6 space-y-5 pb-20 pt-6 md:py-10">
            <HeaderDescrip
                title="Your Stores"
                description="You can create up to 3 stores. Each store can have up to 100 products."
            />
            {stores?.length > 0 ?(
                <div>
                    {stores.map((store)=>(
                        <Link key={store.id} href={`/account/stores/${store.id}`}>
                            <div className="flex h-40 flex-col border p-5 rounded-md shadow-md hover:bg-muted">
                                <div className="flex items-center space-x-2">
                                    <Icons.store className="h-5 w-5 text-muted-foreground"/>
                                    <h2 className="line-clamp-1 text-lg flex-1 font-bold">
                                        {store.name}
                                    </h2>
                                </div>
                                <p className="text-sm sm:tex-base text-muted-foreground mt-2">
                                    {store.description}
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {store.products.length} products
                                </p>
                            </div>
                        </Link>
                    ))}
                    {stores.length < 3 && (
                        <Link href="/account/stores/add">
                            <div className="flex h-40 flex-col border p-5 rounded-md shadow-md hover:bg-muted">
                                <div className="flex items-center space-x-2">
                                    <Icons.add className="h-5 w-5 text-muted-foreground"/>
                                    <h2 className="text-lg flex-1 font-bold line-clamp-1">
                                        Create a new store
                                    </h2>
                                </div>
                                <p className="mt-2 flex-1 text-sm text-muted-foreground sm:text-base">
                                    You can create up to 3 stores
                                </p>
                            </div>
                        </Link>
                    )}
                </div>
            ):(
                <div>
                    {Array.from({length: 3}).map((_, index)=>(
                        <Skeleton key={index} className="h-40"/>
                    ))}
                </div>
            )}
        </section>
    )
}