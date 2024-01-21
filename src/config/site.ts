export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: "Skateshop",
    description: 
        "Skateshop is a demo e-commerce site built with Next.js and Stripe Checkout.",
    url: "https://skateshop.vercel.app",
    ogImage: "https://skateshop.vercel.app/opengraph-image.png",

    mainNav: [],
    secondaryNav: [

        {
            title: "SkateBoards",
            href: "/skateboards",
        },
    
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
        linkedin: "https://www.linkedin.com/in/amama-fatima-2b1b1a1b1/",
    }
    
}