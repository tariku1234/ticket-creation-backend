import express from "express"
import cors from "cors"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"
import ticketRoutes from "./routes/tickets.js"
import { setupSSE } from "./sse.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Data directory
const dataDir = join(__dirname, "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Routes
app.use("/tickets", ticketRoutes)

// SSE endpoint
setupSSE(app)

app.listen(PORT, () => {
  console.log(`✓ Service Desk backend running on http://localhost:${PORT}`)
})
