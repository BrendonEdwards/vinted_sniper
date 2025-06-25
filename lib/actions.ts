"use server"

import { revalidatePath } from "next/cache"
import {
  addTrackedUrl as dbAddTrackedUrl,
  deleteTrackedUrl as dbDeleteTrackedUrl,
  toggleUrlStatus as dbToggleUrlStatus,
} from "./database"

export async function addTrackedUrl(formData: FormData) {
  try {
    const url = formData.get("url") as string
    const name = formData.get("name") as string

    if (!url) {
      return { success: false, error: "URL is required" }
    }

    // Basic URL validation
    if (!url.includes("vinted.") || !url.includes("catalog")) {
      return { success: false, error: "Please provide a valid Vinted search URL" }
    }

    await dbAddTrackedUrl(url, name)
    revalidatePath("/")

    return { success: true }
  } catch (error: any) {
    console.error("Error in addTrackedUrl action:", error)

    if (error.message?.includes("duplicate key")) {
      return { success: false, error: "This URL is already being tracked" }
    }

    return { success: false, error: "Failed to add URL" }
  }
}

export async function deleteTrackedUrl(id: number) {
  try {
    await dbDeleteTrackedUrl(id)
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteTrackedUrl action:", error)
    return { success: false, error: "Failed to delete URL" }
  }
}

export async function toggleUrlStatus(id: number) {
  try {
    await dbToggleUrlStatus(id)
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error in toggleUrlStatus action:", error)
    return { success: false, error: "Failed to update URL status" }
  }
}
