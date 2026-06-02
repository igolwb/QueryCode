"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import { Button } from "@/components/ui/button"

export function AuthControls() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading session…</p>
  }

  if (user) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm">
          Signed in as{" "}
          <span className="font-medium">{user.name ?? user.email}</span>
        </p>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="/auth/logout">Log out</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button asChild size="sm">
      <a href="/auth/login">Log in with Auth0</a>
    </Button>
  )
}
