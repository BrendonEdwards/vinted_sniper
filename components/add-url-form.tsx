"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addTrackedUrl } from "@/lib/actions"
import { Loader2 } from "lucide-react"

export function AddUrlForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await addTrackedUrl(formData)
      if (result.success) {
        toast({
          title: "URL Added",
          description: "The URL has been added to your tracking list.",
        })
        // Reset form
        const form = document.getElementById("add-url-form") as HTMLFormElement
        form?.reset()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add URL",
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
      setIsLoading(false)
    }
  }

  return (
    <form id="add-url-form" action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name (Optional)</Label>
        <Input id="name" name="name" placeholder="e.g., Nike Sneakers Size 10" disabled={isLoading} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Vinted Search URL</Label>
        <Textarea
          id="url"
          name="url"
          placeholder="https://www.vinted.co.uk/catalog?..."
          required
          disabled={isLoading}
          className="min-h-[80px]"
        />
        <p className="text-sm text-muted-foreground">Copy the URL from your Vinted search results page</p>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Add URL
      </Button>
    </form>
  )
}
