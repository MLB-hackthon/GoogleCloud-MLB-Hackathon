from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import chat, content
from datetime import datetime

app = FastAPI(
    title="MLB API",
    description="Backend API for MLB application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(content.router, prefix="/api/v1/content", tags=["content"])

@app.get("/")
async def root():
    return {"message": "Welcome to MLB API"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }