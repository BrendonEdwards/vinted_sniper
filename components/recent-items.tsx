"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Clock } from "lucide-react"

interface RecentItem {
  id: number
  item_id: string
  title: string | null
  subtitle: string | null
  price: string | null
  item_url: string | null
  first_seen: string
  url_name: string | null
}

interface RecentItemsProps {
  items: RecentItem[]
}

export function RecentItems({ items }: RecentItemsProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No recent items found.</p>
        <p className="text-sm">Items will appear here when new listings are detected.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {items.map((item) => (
        <Card key={item.id} className="p-3">
          <CardContent className="p-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{item.title || "Untitled Item"}</h4>
                  {item.price && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {item.price}
                    </Badge>
                  )}
                </div>

                {item.subtitle && <p className="text-sm text-muted-foreground truncate mb-1">{item.subtitle}</p>}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>From: {item.url_name || "Unnamed URL"}</span>
                  <span>•</span>
                  <span>{new Date(item.first_seen).toLocaleString()}</span>
                </div>
              </div>

              {item.item_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(item.item_url!, "_blank")}
                  className="shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
