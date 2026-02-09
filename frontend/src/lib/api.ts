export interface ClassifyRequest {
  texts: string[];
  categories: string[];
}

export interface ClassificationResult {
  text: string;
  category: string;
  similarity_score: number;
}

export interface ClassifyResponse {
  results: ClassificationResult[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function classify(request: ClassifyRequest): Promise<ClassifyResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);
  try {
    const response = await fetch(`${API_BASE_URL}/api/classify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Sınıflandırma başarısız oldu");
    }
    return response.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("İstek zaman aşımına uğradı. Lütfen daha az metin ile tekrar deneyin.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
