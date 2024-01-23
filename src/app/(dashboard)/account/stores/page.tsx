import Link from "next/link"
import { notFound } from "next/navigation"
import { Icons } from "~/components/icons"
import { Skeleton } from "~/components/ui/skeleton"
import { prisma } from "~/lib/db"
import { getCurrentUser } from "~/lib/session"



export default async function StoresPage(){

    // const user = await getCurrentUser()
    // if(!user){
    //     return notFound()
    // }
    const user = await prisma.user.findUnique({
        where:{
            id: "1"
        }
    })
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
        <section className="container grid items-center space-y-5 pb-20 pt-6 md:py-10">
            {/* container grid items-center gap-6 space-y-5 pb-20 pt-6 md:py-10"> */}
            <div className="flex max-w-[980px] flex-col items-start gap-2">
                <h1 className="text-3xl font-bold leading-tight tracking-tighter sm:text-4xl">
                    Your Stores
                </h1>
                <p className="max-w-[700px] text-base text-muted-foreground sm:text-lg">
                    You can create up to 3 stores. Each store can have up to 100 products.
                </p>
            </div>
            {stores?.length > 0 ?(
                <div>
                    {stores.map((store)=>(
                        <Link key={store.id} href={`/account/stores/${store.id}`}>
                            <div className="flex h-40 flex-col border p-5 rounded-md shadow-md hover:bg-muted">
                                <div className="flex items-center space-x-2">
                                    <Icons.store className="h-5 w-5 text-muted-foreground"/>
                                    <h2 className="line-clamp-1 text-base font-bold sm:text-lg">
                                        {store.name}
                                    </h2>
                                </div>
                                <p className="text-sm sm:tex-base text-muted-foreground mt-2">
                                    {store.description}
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                                    {store.products.length} products
                                </p>
                            </div>
                        </Link>
                    ))}
                    {stores.length < 3 && (
                        <Link href="/account/stores/new">
                            <div className="flex h-40 flex-col border p-5 rounded-md shadow-md hover:bg-muted">
                                <div className="flex items-center space-x-2">
                                    <Icons.add className="h-5 w-5 text-muted-foreground"/>
                                    <h2 className="text-base font-bold line-clamp-1 sm:text-lg">
                                        Create a new store
                                    </h2>
                                </div>
                                <p className="mt-2.5 line-clamp-2 flex-1 text-sm text-muted-foreground sm:text-base">
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