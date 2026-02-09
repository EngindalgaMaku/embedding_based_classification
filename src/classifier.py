from src.embedding_client import EmbeddingClient
from src.models import Category, ClassificationResult
from src.similarity import SimilarityCalculator


class ZeroShotClassifier:
    def __init__(self, embedding_client: EmbeddingClient):
        self._embedding_client = embedding_client
        self._categories: list[Category] = []

    def add_categories(self, category_names: list[str]) -> None:
        embeddings = self._embedding_client.get_embeddings_batch(category_names)
        for name, embedding in zip(category_names, embeddings):
            self._categories.append(Category(name=name, embedding=embedding))

    def add_category(self, category_name: str) -> None:
        embedding = self._embedding_client.get_embedding(category_name)
        self._categories.append(Category(name=category_name, embedding=embedding))

    def classify(self, text: str) -> ClassificationResult:
        if not self._categories:
            raise ValueError("En az bir kategori tanımlanmalı")
        text_embedding = self._embedding_client.get_embedding(text)
        best_category = None
        best_score = float("-inf")
        for category in self._categories:
            score = SimilarityCalculator.cosine_similarity(text_embedding, category.embedding)
            if score > best_score:
                best_score = score
                best_category = category
        return ClassificationResult(
            text=text,
            category=best_category.name,
            similarity_score=best_score,
        )

    def classify_batch(self, texts: list[str]) -> list[ClassificationResult]:
        if not self._categories:
            raise ValueError("En az bir kategori tanımlanmalı")
        text_embeddings = self._embedding_client.get_embeddings_batch(texts)
        results = []
        for text, text_embedding in zip(texts, text_embeddings):
            best_category = None
            best_score = float("-inf")
            for category in self._categories:
                score = SimilarityCalculator.cosine_similarity(text_embedding, category.embedding)
                if score > best_score:
                    best_score = score
                    best_category = category
            results.append(ClassificationResult(
                text=text,
                category=best_category.name,
                similarity_score=best_score,
            ))
        return results
