import { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';
import { useAmp } from 'next/amp';
const prisma = new PrismaClient();

//seeding the database based on the schema


async function main(){
    const user1: User = await prisma.user.upsert({
        where: {
            id: "1"
        },
        update: {},
        create: {
            id: "1",
            name: "John Doe",
            email: "JohnDoes@gmail.com",
            image: "https://pbs.twimg.com/profile_images/1364491704816005632/4iY6yMgX_400x400.jpg",
            emailVerified:  new Date(),
            role: "USER",
            active: true,
            seller: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    })


    const account1 = await prisma.account.upsert({
        where: {
            id: "AccountID1"
        },
        update: {},
        create: {
                id: "AccountID1",
                userId: user1.id,
                type: "PAYPAL",
                provider: "PAYPAL",
                providerAccountId: "PaypalID1",
                refresh_token: "PaypalRefreshToken1",
                access_token: "PaypalAccessToken1",
                expires_at: 100,
                token_type: "Bearer",
                scope: "email",
                id_token: "PaypalIDToken1",
                session_state: "PaypalSessionState1",
        }
    })
    

    await prisma.account.update({
        where: {
            id: account1.id
        },
        data: {
            user: {
                connect: {
                    id: user1.id
                }
            }
        }
    })

    const store1 = await prisma.store.upsert({
        where: {
            id: "StoreID1"
        },
        update: {},
        create: {
            id: "StoreID1",
            name: "Store1",
            description: "Store1Description",
            image: "Store1Image",
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: user1.id,

        }
    })

    //upsert another store
    const store2 = await prisma.store.upsert({
        where: {
            id: "StoreID2"
        },
        update: {},
        create: {
            id: "StoreID2",
            name: "Store2",
            description: "Store2Description",
            image: "Store2Image",
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: user1.id,

        }
    })

    const store1Product1 = await prisma.product.upsert({
        where: {
            id: "Store1Product1"
        },
        update: {},
        create: {
            id: "Store1Product1",
            name: "Store1Product1",
            description: "Store1Product1Description",
            price: 100,
            image: "Store1Product1Image",
            catergory: "SKATEBOARD",
            quantity: 100,
            inventory: 2,
            rating: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
            storeId: store1.id,
        }
    })
    //upsert another product
    const store2Product2 = await prisma.product.upsert({
        where: {
            id: "Store1Product2"
        },
        update: {},
        create: {
            id: "Store1Product2",
            name: "Store1Product2",
            description: "Store1Product2Description",
            price: 100,
            image: "Store1Product2Image",
            catergory: "SKATEBOARD",
            quantity: 100,
            inventory: 2,
            rating: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
            storeId: store1.id,
        }
    })

    //upsert another product
    const store2Product3 = await prisma.product.upsert({
        where: {
            id: "Store2Product3"
        },
        update: {},
        create: {
            id: "Store2Product3",
            name: "Store2Product3",
            description: "Store2Product3Description",
            price: 100,
            image: "Store2Product3Image",
            catergory: "SKATEBOARD",
            quantity: 100,
            inventory: 2,
            rating: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
            storeId: store2.id,
        }
    })

    //upadate the store with the product
    await prisma.store.update({
        where: {
            id: store1.id
        },
        data: {
            products: {
                connect: {
                    id: store1Product1.id
                }
            }
        }
    })



    //update store 2 with product
    await prisma.store.update({
        where: {
            id: store2.id
        },
        data: {
            products: {
                connect: {
                    id: store2Product2.id
                }
            }
        }
    })

    //update store 2 with product
    await prisma.store.update({
        where: {
            id: store2.id
        },
        data: {
            products: {
                connect: {
                    id: store2Product3.id
                }
            }
        }
    })

    //connect store to user
    await prisma.user.update({
        where: {
            id: user1.id
        },
        data: {
            stores: {
                connect: {
                    id: store1.id
                }
            }
        }
    })

    //connect store 2 with user
    await prisma.user.update({
        where: {
            id: user1.id
        },
        data: {
            stores: {
                connect: {
                    id: store2.id
                }
            }
        }
    })

    console.log("Seeding complete");
}


main()
    .catch((e)=>{
        console.error(e);
        process.exit(1);
    })
    .finally(async ()=>{
        await prisma.$disconnect();
})

