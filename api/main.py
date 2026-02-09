import os
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from api.schemas import ClassifyRequest, ClassifyResponse, ClassificationResultItem
from src.embedding_client import EmbeddingClient
from src.classifier import ZeroShotClassifier

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

embedding_client: EmbeddingClient | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global embedding_client
    embedding_client = EmbeddingClient()
    yield


app = FastAPI(title="Zero-Shot Sınıflandırma API", lifespan=lifespan)

cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000,https://class.kodleon.com").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.get("/")
def health():
    return {"status": "ok", "service": "Zero-Shot Sınıflandırma API"}


@app.post("/api/classify", response_model=ClassifyResponse)
def classify(request: ClassifyRequest):
    try:
        classifier = ZeroShotClassifier(embedding_client)
        classifier.add_categories(request.categories)
        results = classifier.classify_batch(request.texts)
        return ClassifyResponse(
            results=[
                ClassificationResultItem(
                    text=r.text,
                    category=r.category,
                    similarity_score=round(r.similarity_score, 4),
                )
                for r in results
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
