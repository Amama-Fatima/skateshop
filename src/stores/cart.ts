import type { Product } from "@prisma/client";
import {create} from "zustand";
import {createJSONStorage, devtools, persist} from "zustand/middleware";


type CartState = {
    products: Product[];
    addProduct: (product: Product)=> void;
    removeProduct: (id: string)=> void;
    removeProducts: (ids: string[])=>void;
    setQuantity: (id: string, quanity: number)=> void;

}

export const useCartStore = create<CartState>()(
    devtools(
        persist(
            (set)=>({
                products: [],
                addProduct: (product)=>{
                    set((state)=>({
                        products: state.products.some((p)=> p.id === product.id)
                            ? state.products.map((p)=>
                                p.id === product.id
                                    ? {...p, quantity: p.quantity + 1 } : p
                                ) : 
                                [...state.products, {...product, quanitity: 1}],
                    }));
                },
                removeProduct: (id)=>{
                    set((state)=>({
                        products: state.products.filter((product)=> product.id !=id),
                    }));
                },
                removeProducts: (ids)=>{
                    set((state)=>({
                        products: state.products.filter((product)=> !ids.includes(product.id))
                    }));
                },
                setQuantity: (id, quantity)=>{
                    set((state)=>({
                        products: state.products.map((product)=>{
                            if(product.id === id){
                                return {...product, quantity}
                            }
                            return product;
                        }),
                    }));
                },
                isLoading: false, 
            }),
            {
                name: "cart-store",
                storage: createJSONStorage(()=>sessionStorage),
            }
        )
    )
)
