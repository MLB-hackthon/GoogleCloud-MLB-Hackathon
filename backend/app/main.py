from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .api.endpoints import chat, content, auth, player
from .core.database import Base, engine, get_db
from datetime import datetime
from .models.user import User  # Import your User model
from fastapi.responses import JSONResponse
from sqlalchemy import text

# Create tables before starting the app
async def create_tables():
    Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MLB API",
    description="Backend API for MLB application",
    version="1.0.0",
    on_startup=[create_tables]
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8080",
        "http://34.56.194.81.nip.io",
        "http://34.56.194.81.nip.io:8000",
        "http://34.56.194.81.nip.io:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(content.router, prefix="/api/v1/content", tags=["content"])
app.include_router(player.router, prefix="/api/v1/player", tags=["player"])

@app.get("/")
async def root():
    return {"message": "Welcome to MLB API"}

@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        # Test database connection with commit
        db.execute(text("SELECT 1"))
        db.commit()  # Add explicit commit
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
        return JSONResponse(
            content={
                "status": "unhealthy",
                "database": db_status,
                "timestamp": datetime.now().isoformat()
            },
            status_code=503
        )
    
    return {
        "status": "healthy",
        "database": db_status,
        "timestamp": datetime.now().isoformat()
    }