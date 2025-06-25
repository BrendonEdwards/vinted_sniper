import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Eye, Bell, LinkIcon } from "lucide-react"
import { getTrackedUrls, getRecentItems } from "@/lib/database"
import { AddUrlForm } from "@/components/add-url-form"
import { UrlList } from "@/components/url-list"
import { RecentItems } from "@/components/recent-items"
import { NotificationSetup } from "@/components/notification-setup"

export default async function HomePage() {
  const urls = await getTrackedUrls()
  const recentItems = await getRecentItems()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Vinted Monitor</h1>
          <p className="text-lg text-gray-600">Track your favorite Vinted listings and get notified of new items</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tracked URLs</CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{urls.length}</div>
              <p className="text-xs text-muted-foreground">Active monitoring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Items</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentItems.length}</div>
              <p className="text-xs text-muted-foreground">Items found today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">Real-time alerts</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New URL
                </CardTitle>
                <CardDescription>Add a Vinted search URL to monitor for new listings</CardDescription>
              </CardHeader>
              <CardContent>
                <AddUrlForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you want to be notified of new items</CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationSetup />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tracked URLs</CardTitle>
                <CardDescription>Manage your monitored Vinted search URLs</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading URLs...</div>}>
                  <UrlList urls={urls} />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Items</CardTitle>
                <CardDescription>Latest items found from your tracked URLs</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading items...</div>}>
                  <RecentItems items={recentItems} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
