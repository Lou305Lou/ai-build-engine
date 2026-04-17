import uvicorn

from app.api.api_app import app
from app.api import init_api

init_api(app)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
