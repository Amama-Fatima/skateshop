import Header from "~/components/layouts/header"
import SiteFooter from "~/components/layouts/site-footer"
import { getCurrentUser } from "~/lib/session"

interface LofiLayoutProps {
  children: React.ReactNode
}

export default function LofiLayout({ children }: LofiLayoutProps) {
  // const user = await getCurrentUser();
  const user = {
    name: "Chad",
    image:
      "https://pbs.twimg.com/profile_images/1364491704816005632/4iY6yMgX_400x400.jpg",
    email: "jjj",
  }

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
    </div>
  )
}
