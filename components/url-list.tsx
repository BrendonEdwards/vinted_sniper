"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Trash2, Play, Pause } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteTrackedUrl, toggleUrlStatus } from "@/lib/actions"

interface TrackedUrl {
  id: number
  url: string
  name: string | null
  is_active: boolean
  created_at: string
}

interface UrlListProps {
  urls: TrackedUrl[]
}

export function UrlList({ urls }: UrlListProps) {
  const [isLoading, setIsLoading] = useState<number | null>(null)
  const { toast } = useToast()

  async function handleDelete(id: number) {
    setIsLoading(id)
    try {
      const result = await deleteTrackedUrl(id)
      if (result.success) {
        toast({
          title: "URL Deleted",
          description: "The URL has been removed from tracking.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete URL",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  async function handleToggle(id: number) {
    setIsLoading(id)
    try {
      const result = await toggleUrlStatus(id)
      if (result.success) {
        toast({
          title: "Status Updated",
          description: "URL monitoring status has been updated.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  if (urls.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No URLs tracked yet.</p>
        <p className="text-sm">Add your first Vinted search URL above.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {urls.map((url) => (
        <Card key={url.id} className="p-3">
          <CardContent className="p-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{url.name || "Unnamed URL"}</h4>
                  <Badge variant={url.is_active ? "default" : "secondary"}>{url.is_active ? "Active" : "Paused"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{url.url}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Added {new Date(url.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => window.open(url.url, "_blank")}>
                  <ExternalLink className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={() => handleToggle(url.id)} disabled={isLoading === url.id}>
                  {url.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(url.id)}
                  disabled={isLoading === url.id}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
