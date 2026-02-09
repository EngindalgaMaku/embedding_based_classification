import os

from openai import OpenAI


class EmbeddingClient:
    def __init__(self, api_key: str | None = None, model: str = "text-embedding-3-small"):
        self.model = model
        resolved_key = api_key or os.environ.get("OPENROUTER_API_KEY")
        if not resolved_key:
            raise ValueError("API anahtarı bulunamadı. api_key parametresi veya OPENROUTER_API_KEY ortam değişkeni gereklidir.")
        self._client = OpenAI(
            api_key=resolved_key,
            base_url="https://openrouter.ai/api/v1",
        )

    def get_embedding(self, text: str) -> list[float]:
        if not text or not text.strip():
            raise ValueError("Metin boş olamaz.")
        try:
            response = self._client.embeddings.create(
                input=text,
                model=self.model,
            )
            return response.data[0].embedding
        except Exception as e:
            raise RuntimeError(f"Embedding alınırken hata oluştu: {e}") from e

    def get_embeddings_batch(self, texts: list[str]) -> list[list[float]]:
        """Birden fazla metin için tek API çağrısıyla embedding'leri alır."""
        if not texts:
            return []
        for t in texts:
            if not t or not t.strip():
                raise ValueError("Metin boş olamaz.")
        try:
            response = self._client.embeddings.create(
                input=texts,
                model=self.model,
            )
            sorted_data = sorted(response.data, key=lambda x: x.index)
            return [item.embedding for item in sorted_data]
        except Exception as e:
            raise RuntimeError(f"Embedding alınırken hata oluştu: {e}") from e
    def get_embeddings_batch(self, texts: list[str]) -> list[list[float]]:
        """Birden fazla metin için tek API çağrısıyla embedding'leri alır."""
        if not texts:
            return []
        for t in texts:
            if not t or not t.strip():
                raise ValueError("Metin boş olamaz.")
        try:
            response = self._client.embeddings.create(
                input=texts,
                model=self.model,
            )
            # API sonuçları index sırasına göre sıralı olmayabilir
            sorted_data = sorted(response.data, key=lambda x: x.index)
            return [item.embedding for item in sorted_data]
        except Exception as e:
            raise RuntimeError(f"Embedding alınırken hata oluştu: {e}") from e
