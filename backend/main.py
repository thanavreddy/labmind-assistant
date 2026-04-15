"""FastAPI backend server entry point."""

if __name__ == "__main__":
    import uvicorn
    import os
    from app.config import get_settings
    
    settings = get_settings()
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    )
