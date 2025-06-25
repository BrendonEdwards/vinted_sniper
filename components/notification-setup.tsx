"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Bell, BellOff } from "lucide-react"

export function NotificationSetup() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const { toast } = useToast()

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
      setNotificationsEnabled(Notification.permission === "granted")
    }
  }, [])

  async function requestPermission() {
    if (!("Notification" in window)) {
      toast({
        title: "Not Supported",
        description: "This browser doesn't support notifications",
        variant: "destructive",
      })
      return
    }

    const result = await Notification.requestPermission()
    setPermission(result)

    if (result === "granted") {
      setNotificationsEnabled(true)
      toast({
        title: "Notifications Enabled",
        description: "You'll now receive notifications for new items",
      })

      // Test notification
      new Notification("Vinted Monitor", {
        body: "Notifications are now enabled!",
        icon: "/favicon.ico",
      })
    } else {
      toast({
        title: "Permission Denied",
        description: "Please enable notifications in your browser settings",
        variant: "destructive",
      })
    }
  }

  function toggleNotifications() {
    if (permission !== "granted") {
      requestPermission()
    } else {
      setNotificationsEnabled(!notificationsEnabled)
      toast({
        title: notificationsEnabled ? "Notifications Disabled" : "Notifications Enabled",
        description: notificationsEnabled
          ? "You won't receive notifications anymore"
          : "You'll now receive notifications for new items",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base">Browser Notifications</Label>
          <p className="text-sm text-muted-foreground">Get notified when new items are found</p>
        </div>
        <Switch checked={notificationsEnabled} onCheckedChange={toggleNotifications} />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {permission === "granted" ? (
          <>
            <Bell className="h-4 w-4 text-green-600" />
            <span>Notifications are enabled</span>
          </>
        ) : permission === "denied" ? (
          <>
            <BellOff className="h-4 w-4 text-red-600" />
            <span>Notifications are blocked</span>
          </>
        ) : (
          <>
            <Bell className="h-4 w-4 text-yellow-600" />
            <span>Click to enable notifications</span>
          </>
        )}
      </div>

      {permission === "denied" && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Notifications are blocked. Please enable them in your browser settings and refresh the page.
          </p>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (permission === "granted") {
            new Notification("Test Notification", {
              body: "This is a test notification from Vinted Monitor",
              icon: "/favicon.ico",
            })
          } else {
            requestPermission()
          }
        }}
        disabled={permission === "denied"}
      >
        Test Notification
      </Button>
    </div>
  )
}
