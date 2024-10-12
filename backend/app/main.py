# app/main.py

from fastapi import FastAPI
from .api import options  
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Stock Options API",
    description="API for fetching stock options data",
    version="1.0.0",
)

# CORS settings to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(options.router, prefix="/api/options")
