import { type NextRequest, NextResponse } from "next/server"
import { getTrackedUrls, getRecentItemIds, addTrackedItem } from "@/lib/database"
import * as cheerio from "cheerio"

// This would be called by a cron job or webhook
export async function POST(request: NextRequest) {
  try {
    const urls = await getTrackedUrls()
    const newItems = []

    for (const url of urls) {
      if (!url.is_active) continue

      try {
        // In a real implementation, you'd need to handle web scraping here
        // This is a simplified version that would need proper scraping logic
        const items = await scrapeVintedUrl(url.url)
        const recentIds = await getRecentItemIds(url.id)

        for (const item of items.slice(0, 2)) {
          if (!recentIds.includes(item.item_id)) {
            const newItem = await addTrackedItem(url.id, item)
            if (newItem) {
              newItems.push({
                ...newItem,
                url_name: url.name,
              })
            }
          }
        }
      } catch (error) {
        console.error(`Error checking URL ${url.id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      newItems: newItems.length,
      items: newItems,
    })
  } catch (error) {
    console.error("Error in check-items API:", error)
    return NextResponse.json({ success: false, error: "Failed to check items" }, { status: 500 })
  }
}

// Basic scraping implementation using fetch and cheerio
// This parses the Vinted search results page and returns the first
// two items found. It is intentionally simple and may require
// adjustments if Vinted changes their markup or introduces additional
// anti scraping measures.

async function scrapeVintedUrl(url: string) {
  const res = await fetch(url, {
    headers: {
      // Pretend to be a regular browser to avoid easy blocking
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
    },
  })

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }

  const html = await res.text()
  const $ = cheerio.load(html)
  const items: {
    item_id: string
    title?: string
    subtitle?: string
    price?: string
    item_url?: string
  }[] = []

  $("div.feed-grid__item").each((i, el) => {
    if (i >= 2) return false

    const container = $(el).find("div.new-item-box__container")
    if (!container.length) return

    const dataTestId = container.attr("data-testid") || ""
    const itemId = dataTestId.split("-").pop() || ""

    let itemUrl = container.find("a[href]").attr("href") || ""
    if (itemUrl && !itemUrl.startsWith("http")) {
      itemUrl = `https://www.vinted.co.uk${itemUrl}`
    }

    const title = container
      .find("p[data-testid$='--description-title']")
      .text()
      .trim()
    const subtitle = container
      .find("p[data-testid$='--description-subtitle']")
      .text()
      .trim()
    const price = container
      .find("p[data-testid$='--price-text']")
      .text()
      .trim()

    items.push({ item_id: itemId, title, subtitle, price, item_url: itemUrl })
  })

  return items
}
