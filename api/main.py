import os
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from api.schemas import (
    ClassifyRequest, ClassifyResponse, ClassificationResultItem,
    FilterRequest, FilterResponse, FilterResultItem, FilterMatch,
)
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
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
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


@app.post("/api/filter", response_model=FilterResponse)
def filter_content(request: FilterRequest):
    """Her metin için her filtre kategorisini ayrı ayrı kontrol eder."""
    try:
        # Tüm metinlerin ve filtre adlarının embedding'lerini toplu al
        all_texts = request.texts + request.filters + ["Temiz ve zararsız içerik"]
        all_embeddings = embedding_client.get_embeddings_batch(all_texts)

        text_embeddings = all_embeddings[: len(request.texts)]
        filter_embeddings = all_embeddings[len(request.texts) : len(request.texts) + len(request.filters)]
        clean_embedding = all_embeddings[-1]

        from src.similarity import SimilarityCalculator

        results = []
        for text, text_emb in zip(request.texts, text_embeddings):
            matches = []
            is_flagged = False
            for filter_name, filter_emb in zip(request.filters, filter_embeddings):
                filter_score = SimilarityCalculator.cosine_similarity(text_emb, filter_emb)
                clean_score = SimilarityCalculator.cosine_similarity(text_emb, clean_embedding)
                matched = filter_score > clean_score
                if matched:
                    is_flagged = True
                matches.append(FilterMatch(
                    filter_name=filter_name,
                    score=round(filter_score, 4),
                    matched=matched,
                ))
            results.append(FilterResultItem(
                text=text,
                matches=matches,
                is_flagged=is_flagged,
            ))

        return FilterResponse(results=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
