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


class FilterRequest(BaseModel):
    texts: list[str]
    filters: list[str]

    @field_validator("texts")
    @classmethod
    def texts_not_empty(cls, v: list[str]) -> list[str]:
        if not v:
            raise ValueError("Metin listesi boş olamaz")
        return v

    @field_validator("filters")
    @classmethod
    def filters_not_empty(cls, v: list[str]) -> list[str]:
        if not v:
            raise ValueError("Filtre listesi boş olamaz")
        return v


class FilterMatch(BaseModel):
    filter_name: str
    score: float
    matched: bool


class FilterResultItem(BaseModel):
    text: str
    matches: list[FilterMatch]
    is_flagged: bool


class FilterResponse(BaseModel):
    results: list[FilterResultItem]
