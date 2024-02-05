import Header from "~/components/layouts/header"
import SiteFooter from "~/components/layouts/site-footer"
import { getCurrentUser } from "~/lib/session"

interface LofiLayoutProps {
  children: React.ReactNode
}

export default async function LofiLayout({ children }: LofiLayoutProps) {
  const user = await getCurrentUser()

  return (
    <div>
      <Header
        user={{
          name: user?.name,
          image: user?.image,
          email: user?.email,
        }}
      />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
