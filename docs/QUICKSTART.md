# Quickstart

## 1. Install
pip install -r requirements.txt

## 2. Run
bash scripts/run_local.sh

## 3. Test
GET /api/status/health

## 4. Command Example
POST /api/commands
{
  "command": "status",
  "payload": {}
}
