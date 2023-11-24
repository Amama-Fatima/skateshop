import "~/styles/globals.css";
import type { Metadata } from "next";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import { fontSans } from "~/lib/fonts";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";
import { TailwindIndicator } from "~/components/tailwind-indicator";


export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`, //dynamically setting the title of different pages, where %s would be replaced with the specific page's title, followed by the site name.
    },
    description: siteConfig.description,

    keywords: [
        "Next.js",
        "React",
        "Tailwind CSS",
        "Server Components",
        "AI",
        "AI Playground",
        "AI Chat",
    ],
    authors: [
        {
            name: 'amama fatima',
            url: "https://github.com/amama-fatima"
        },
    ],
    creator: 'amama-fatima',
    themeColor: [
        {media: "(prefers-color-scheme: dark)", color: 'white'},
        {media: "(prefers-color-scheme: light)", color: 'black'},
    ],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        images: [`${siteConfig.url}/og.jpg`],
        creator: "@sadmann7",
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
}


interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <>
            <html lang="en" suppressHydrationWarning>
                <head/>
                <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
                    <ThemeProvider attribute='class' defaultTheme='system' enableSystem >
                        {children}
                        <Toaster/>
                        <TailwindIndicator/>
                    </ThemeProvider>
                </body>
            </html>
        </>
    );
}
