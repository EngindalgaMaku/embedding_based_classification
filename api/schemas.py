from pydantic import BaseModel, field_validator


class ClassifyRequest(BaseModel):
    texts: list[str]
    categories: list[str]

    @field_validator("texts")
    @classmethod
    def texts_not_empty(cls, v: list[str]) -> list[str]:
        if not v:
            raise ValueError("Metin listesi boş olamaz")
        return v

    @field_validator("categories")
    @classmethod
    def categories_not_empty(cls, v: list[str]) -> list[str]:
        if not v:
            raise ValueError("Kategori listesi boş olamaz")
        return v


class ClassificationResultItem(BaseModel):
    text: str
    category: str
    similarity_score: float


class ClassifyResponse(BaseModel):
    results: list[ClassificationResultItem]
