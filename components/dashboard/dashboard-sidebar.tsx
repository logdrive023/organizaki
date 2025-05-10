// <-- NO "use client" here!
import { cookies } from "next/headers"
import DashboardSidebarClient from "./DashboardSidebarClient"

export default async function DashboardSidebar() {
  // 1) Await the cookie store
  const cookieStore = await cookies()
  const raw = cookieStore.get("user-info")?.value

  let user: { name: string; email: string } | null = null
  if (raw) {
    try {
      user = JSON.parse(raw)
    } catch {
      // ignore malformed cookie
    }
  }

  // 2) Render the client component, passing down the user
  return <DashboardSidebarClient user={user} />
}
