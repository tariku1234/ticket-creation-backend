let clients = []

export const setupSSE = (app) => {
  app.get("/events", (req, res) => {
    // Set up SSE headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    })

    // Add client to active connections
    clients.push(res)
    console.log(`✓ Client connected. Active clients: ${clients.length}`)

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`)

    // Handle client disconnect
    req.on("close", () => {
      clients = clients.filter((client) => client !== res)
      console.log(`✗ Client disconnected. Active clients: ${clients.length}`)
    })

    req.on("error", () => {
      clients = clients.filter((client) => client !== res)
    })
  })
}

export const emitNewTicket = (ticket) => {
  const message = `data: ${JSON.stringify({ type: "new-ticket", ticket })}\n\n`
  clients.forEach((client) => {
    try {
      client.write(message)
    } catch (error) {
      console.error("Error sending SSE:", error)
    }
  })
}
