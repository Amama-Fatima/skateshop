
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "~/lib/db";
import {EditStoreForm} from "~/components/forms/edit-store-form";
import { HeaderDescrip } from "~/components/header-descrip";
export const metadata: Metadata = {
    title: "Manage Store",
    description: "Manage your store and products",
}


interface EditStorePageProps{
    params: {
        storeId: string
    }
}

export default async function StorePage({params}: EditStorePageProps){
    const storeId = params.storeId

    const store = await prisma.store.findUnique({
        where: {
            id: storeId,
        },
        select: {
            id: true,
            products:{
                select:{
                    id: true,
                    name: true,
                    description: true,
                    catergory: true,
                    price: true,
                    quantity: true,
                    inventory: true,
                }
            }
        },
    })

    if(!store){
        return notFound()
    }

    return(
        <section className="container grid items-center w-full gap-6 pb-8 pt-6 md:py-10">
            <HeaderDescrip title="Manage Store" description="Manage your store and products"/>
            <EditStoreForm storeId={storeId}/>
        </section>
    )
}

//this method of getting query params works in server side rendering
// for cliemt side, you can use useSearchParams() hook