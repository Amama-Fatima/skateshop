export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: "Skateshop",
    description: 
        "Skateshop is a demo e-commerce site built with Next.js and Stripe Checkout.",
    url: "https://skateshop.vercel.app",
    ogImage: "https://skateshop.vercel.app/opengraph-image.png",

    mainNav: [
        {
            title: "SkateBoards",
            href: "/skateboards",
        },
    ],
    secondaryNav: [
        {
            title: "Clothing",
            href: "/clothing",
        },
        {
            title: "Shoes",
            href: "/shoes",
        },
        {
            title: "Accessories",
            href: "/accessories",
        
        },
    ],
    links: {
        twitter: "https://twitter.com/vercel",
        github: "https://github.com/Amama-Fatima",
    }
    
}