from fastapi import FastAPI
import os

# Initialize FastAPI app
app = FastAPI(
    title="ResumeScore API",
    description="AI-powered resume analysis API",
    version="1.0.0"
)

@app.get("/")
async def root():
    return {"message": "ResumeScore API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "message": "API is running"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=False)