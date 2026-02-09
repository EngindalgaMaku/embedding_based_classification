from dataclasses import dataclass


@dataclass
class Category:
    name: str
    embedding: list[float]


@dataclass
class ClassificationResult:
    text: str
    category: str
    similarity_score: float
