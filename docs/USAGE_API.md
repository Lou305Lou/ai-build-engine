# AI Cloud App — API Usage

## Base URL
http://localhost:8000

## Health Check
GET /api/status/health

## Ping
GET /api/status/ping

## Execute Command
POST /api/commands

### Example Request
{
  "command": "status",
  "payload": {}
}
