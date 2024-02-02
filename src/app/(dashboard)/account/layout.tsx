import Header from "~/components/layouts/header"
import SiteFooter from "~/components/layouts/site-footer"
import { getCurrentUser } from "~/lib/session"

interface DashBoardLayoutProps {
  children: React.ReactNode
}

export default async function DashBoardLayout({
  children,
}: DashBoardLayoutProps) {
  const user = await getCurrentUser()
  // console.log("User in dashboard layout: ", user)

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header
        user={{
          name: user?.name,
          image: user?.image,
          email: user?.email,
        }}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
