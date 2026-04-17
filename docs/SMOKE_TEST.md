# Smoke Test

## 1. Health
GET /api/status/health

## 2. Ping
GET /api/status/ping

## 3. Status Command
POST /api/commands
{
  "command": "status",
  "payload": {}
}

## 4. Generate Project
POST /api/commands
{
  "command": "generate_project",
  "payload": { "project_name": "demo" }
}

## 5. Evaluate Layers
POST /api/commands
{
  "command": "evaluate_layers",
  "payload": { "layers": {} }
}
