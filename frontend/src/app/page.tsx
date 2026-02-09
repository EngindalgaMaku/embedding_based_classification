"use client";

import { useState } from "react";
import TextInput from "@/components/TextInput";
import CategoryManager from "@/components/CategoryManager";
import ResultsTable from "@/components/ResultsTable";
import { classify, ClassificationResult } from "@/lib/api";
import { exportResultsAsJson } from "@/lib/utils";

const DEFAULT_CATEGORIES = [
  "Lojistik ve Kargo",
  "Ürün Kalitesi ve Performans",
  "Müşteri Hizmetleri ve Destek",
];

export default function Home() {
  const [texts, setTexts] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDisabled = texts.length === 0 || categories.length === 0;

  async function handleClassify() {
    setLoading(true);
    setError(null);
    try {
      const response = await classify({ texts, categories });
      setResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Zero-Shot Metin Sınıflandırma
        </h1>

        <TextInput texts={texts} onTextsChange={setTexts} />

        <CategoryManager
          categories={categories}
          onCategoriesChange={setCategories}
        />

        <button
          type="button"
          onClick={handleClassify}
          disabled={isDisabled || loading}
          className="rounded bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sınıflandırılıyor..." : "Sınıflandır"}
        </button>

        {loading && (
          <p role="status" className="text-sm text-gray-500">
            Yükleniyor...
          </p>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <ResultsTable results={results} />
            <button
              type="button"
              onClick={() => exportResultsAsJson(results)}
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              JSON İndir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
