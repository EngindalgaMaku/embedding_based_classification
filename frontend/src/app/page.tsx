"use client";

import { useState } from "react";
import TextInput from "@/components/TextInput";
import CategoryManager from "@/components/CategoryManager";
import ResultsTable from "@/components/ResultsTable";
import PresetSelector from "@/components/PresetSelector";
import { classify, ClassificationResult } from "@/lib/api";
import { exportResultsAsJson, parseTexts } from "@/lib/utils";
import { Preset } from "@/lib/presets";

export default function Home() {
  const [rawText, setRawText] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const texts = parseTexts(rawText);
  const isDisabled = texts.length === 0 || categories.length === 0;

  function handlePresetSelect(preset: Preset) {
    setRawText(preset.texts.join("\n"));
    setCategories(preset.categories);
    setResults([]);
    setError(null);
  }

  function handleReset() {
    setRawText("");
    setCategories([]);
    setResults([]);
    setError(null);
  }

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
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Zero-Shot Metin Sınıflandırma</h1>
        <p className="text-sm text-slate-500 mt-1">
          Metinlerinizi özel kategorilere göre otomatik sınıflandırın
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <PresetSelector onSelect={handlePresetSelect} onReset={handleReset} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <TextInput rawText={rawText} textCount={texts.length} onRawTextChange={setRawText} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <CategoryManager categories={categories} onCategoriesChange={setCategories} />
          </div>

          <button
            type="button"
            onClick={handleClassify}
            disabled={isDisabled || loading}
            className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sınıflandırılıyor...
              </span>
            ) : "Sınıflandır"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <ResultsTable results={results} />
          </div>
          <button
            type="button"
            onClick={() => exportResultsAsJson(results)}
            className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-900 transition-colors"
          >
            JSON İndir
          </button>
        </div>
      )}
    </div>
  );
}
