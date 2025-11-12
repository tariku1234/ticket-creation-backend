# Service Desk Backend

Node.js + Express backend for the Service Desk Queue application.

## Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the server:
   \`\`\`bash
   npm run dev
   \`\`\`

The server will run on `http://localhost:3001`

## API Endpoints

### GET /tickets
Fetch all tickets with optional filtering.

**Query Parameters:**
- `priority` (optional): Filter by priority (LOW, MEDIUM, HIGH)
- `q` (optional): Search query for title and category

**Example:**
\`\`\`
GET /tickets?priority=HIGH&q=urgent
\`\`\`

**Response:**
\`\`\`json
[
  {
    "id": "uuid-string",
    "title": "Urgent issue",
    "priority": "HIGH",
    "category": "Bug",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
\`\`\`

### POST /tickets
Create a new ticket.

**Request Body:**
\`\`\`json
{
  "title": "Network issue",
  "priority": "MEDIUM",
  "category": "Network"
}
\`\`\`

**Response:** Returns the created ticket object with generated ID and timestamp.

### GET /events
Server-Sent Events (SSE) endpoint for live ticket updates.

Connects to this endpoint to receive real-time notifications when new tickets are created.

## Data Storage

Tickets are stored in `data/tickets.json` (automatically created on first run).

## Architecture

- **Tickets CRUD**: Standard REST API with filtering support
- **Live Updates**: SSE for pushing new ticket events to connected clients
- **Data Persistence**: JSON file storage (easily upgradeable to SQLite)
