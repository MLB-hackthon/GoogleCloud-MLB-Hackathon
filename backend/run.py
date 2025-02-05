import uvicorn
import os
from app.main import app

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 443)),
        workers=int(os.getenv("WORKERS", "1")),
        reload=os.getenv("DEBUG", "False").lower() == "true",
        timeout_keep_alive=30,
        timeout_graceful_shutdown=20
    ) 