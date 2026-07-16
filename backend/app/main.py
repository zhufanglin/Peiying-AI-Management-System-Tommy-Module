from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import documents, upload

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="培英 AI 行政平台 - Tommy 文件归档 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(documents.router, prefix="/api", tags=["Documents"])


@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "培英 AI 行政平台 API 运行中"}
