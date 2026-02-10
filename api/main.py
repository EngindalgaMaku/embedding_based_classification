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
    """Her metin için her filtre kategorisini ayrı ayrı kontrol eder.
    
    Her filtre için metin embedding'ini hem filtre hem de karşıt (temiz) referansa
    karşı kontrol eder. Filtre skoru ile temiz skor arasındaki fark belirli bir
    eşiği aşarsa metin o filtre için bayraklanır.
    """
    try:
        MATCH_THRESHOLD = 0.02  # Filtre skoru temiz skordan en az bu kadar yüksek olmalı

        # Her filtre için detaylı açıklama oluştur (embedding kalitesini artırır)
        filter_descriptions = []
        clean_descriptions = []
        for f in request.filters:
            filter_descriptions.append(f"Bu metin {f} içermektedir")
            clean_descriptions.append(f"Bu metin {f} içermemektedir, temiz ve zararsız bir içeriktir")

        all_texts = request.texts + filter_descriptions + clean_descriptions
        all_embeddings = embedding_client.get_embeddings_batch(all_texts)

        n_texts = len(request.texts)
        n_filters = len(request.filters)
        text_embeddings = all_embeddings[:n_texts]
        filter_embeddings = all_embeddings[n_texts:n_texts + n_filters]
        clean_embeddings = all_embeddings[n_texts + n_filters:]

        from src.similarity import SimilarityCalculator

        results = []
        for text, text_emb in zip(request.texts, text_embeddings):
            matches = []
            is_flagged = False
            for i, (filter_name, filter_emb) in enumerate(zip(request.filters, filter_embeddings)):
                filter_score = SimilarityCalculator.cosine_similarity(text_emb, filter_emb)
                clean_score = SimilarityCalculator.cosine_similarity(text_emb, clean_embeddings[i])
                diff = filter_score - clean_score
                matched = diff > MATCH_THRESHOLD
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
