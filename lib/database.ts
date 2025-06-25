import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function getTrackedUrls() {
  try {
    const urls = await sql`
      SELECT * FROM tracked_urls 
      ORDER BY created_at DESC
    `
    return urls
  } catch (error) {
    console.error("Error fetching tracked URLs:", error)
    return []
  }
}

export async function addTrackedUrl(url: string, name?: string) {
  try {
    const result = await sql`
      INSERT INTO tracked_urls (url, name)
      VALUES (${url}, ${name || null})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error adding tracked URL:", error)
    throw error
  }
}

export async function deleteTrackedUrl(id: number) {
  try {
    await sql`
      DELETE FROM tracked_urls WHERE id = ${id}
    `
    return true
  } catch (error) {
    console.error("Error deleting tracked URL:", error)
    throw error
  }
}

export async function toggleUrlStatus(id: number) {
  try {
    await sql`
      UPDATE tracked_urls 
      SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `
    return true
  } catch (error) {
    console.error("Error toggling URL status:", error)
    throw error
  }
}

export async function getRecentItems(limit = 20) {
  try {
    const items = await sql`
      SELECT ti.*, tu.name as url_name
      FROM tracked_items ti
      JOIN tracked_urls tu ON ti.url_id = tu.id
      WHERE ti.first_seen >= CURRENT_DATE
      ORDER BY ti.first_seen DESC
      LIMIT ${limit}
    `
    return items
  } catch (error) {
    console.error("Error fetching recent items:", error)
    return []
  }
}

export async function addTrackedItem(
  urlId: number,
  itemData: {
    item_id: string
    title?: string
    subtitle?: string
    price?: string
    item_url?: string
  },
) {
  try {
    const result = await sql`
      INSERT INTO tracked_items (url_id, item_id, title, subtitle, price, item_url)
      VALUES (${urlId}, ${itemData.item_id}, ${itemData.title || null}, 
              ${itemData.subtitle || null}, ${itemData.price || null}, 
              ${itemData.item_url || null})
      ON CONFLICT (url_id, item_id) DO NOTHING
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error adding tracked item:", error)
    throw error
  }
}

export async function getRecentItemIds(urlId: number, limit = 2) {
  try {
    const items = await sql`
      SELECT item_id FROM tracked_items
      WHERE url_id = ${urlId}
      ORDER BY first_seen DESC
      LIMIT ${limit}
    `
    return items.map((item) => item.item_id)
  } catch (error) {
    console.error("Error fetching recent item IDs:", error)
    return []
  }
}
