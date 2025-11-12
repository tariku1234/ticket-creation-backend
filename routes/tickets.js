import express from "express"
import { v4 as uuidv4 } from "uuid"
import fs from "fs/promises"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { emitNewTicket } from "../sse.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DATA_FILE = join(dirname(__dirname), "data", "tickets.json")

const router = express.Router()

// Initialize data file
const ensureDataFile = async () => {
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2))
  }
}

router.get("/", async (req, res) => {
  try {
    await ensureDataFile()
    const data = await fs.readFile(DATA_FILE, "utf-8")
    let tickets = JSON.parse(data)

    // Filter by priority if provided
    if (req.query.priority) {
      tickets = tickets.filter((t) => t.priority === req.query.priority)
    }

    // Filter by search query if provided
    if (req.query.q) {
      const q = req.query.q.toLowerCase()
      tickets = tickets.filter((t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
    }

    // Sort by createdAt descending
    tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json(tickets)
  } catch (error) {
    console.error("Error reading tickets:", error)
    res.status(500).json({ error: "Failed to fetch tickets" })
  }
})

router.post("/", async (req, res) => {
  try {
    const { title, priority, category } = req.body

    if (!title || !priority || !category) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    await ensureDataFile()
    const data = await fs.readFile(DATA_FILE, "utf-8")
    const tickets = JSON.parse(data)

    const newTicket = {
      id: uuidv4(),
      title,
      priority,
      category,
      createdAt: new Date().toISOString(),
    }

    tickets.push(newTicket)
    await fs.writeFile(DATA_FILE, JSON.stringify(tickets, null, 2))

    // Emit SSE event for live updates
    emitNewTicket(newTicket)

    res.status(201).json(newTicket)
  } catch (error) {
    console.error("Error creating ticket:", error)
    res.status(500).json({ error: "Failed to create ticket" })
  }
})

export default router
