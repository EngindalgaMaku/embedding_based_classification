"use client";

import { useState } from "react";
import { filterContent, FilterResultItem } from "@/lib/api";
import { formatScore } from "@/lib/utils";

const DEFAULT_FILTERS = [
  "Kişisel bilgi ve özel veri",
  "Küfür, hakaret ve şiddet içeriği",
  "Siyasi propaganda ve siyasi içerik",
];

const EXAMPLE_TEXTS = [
  "Ahmet Yılmaz'ın TC kimlik numarası 12345678901'dir.",
  "Bugün hava çok güzel, parkta yürüyüş yaptık.",
  "Bu hükümeti destekleyen herkes aptal, muhalefet kazanmalı.",
  "Müşteri telefon numarası 0532 123 45 67 olarak güncellendi.",
  "Seni öldürürüm lan, bir daha gelme buraya!",
  "Yeni ürün lansmanı önümüzdeki ay yapılacak.",
  "Çalışan maaş bilgisi: 45.000 TL net, IBAN: TR12 0001 0002 0003.",
  "Toplantı salonu yarın 14:00'te müsait.",
  "Bu parti iktidara gelirse ülke batar, oy vermeyin.",
  "Hasta Ayşe Demir'in kan grubu A Rh+ olarak tespit edildi.",
];

export default function FilterPage() {
  const [inputText, setInputText] = useState("");
  const [filters, setFilters] = useState<string[]>(DEFAULT_FILTERS);
  const [newFilter, setNewFilter] = useState("");
  const [results, setResults] = useState<FilterResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const texts = inputText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const flaggedCount = results.filter(r => r.is_flagged).length;

  function loadExamples() {
    setInputText(EXAMPLE_TEXTS.join("\n"));
    setResults([]);
    setError(null);
  }

  function handleReset() {
    setInputText("");
    setFilters(DEFAULT_FILTERS);
    setResults([]);
    setError(null);
  }

  function addFilter() {
    const trimmed = newFilter.trim();
    if (!trimmed) return;
    setFilters([...filters, trimmed]);
    setNewFilter("");
  }

  function removeFilter(index: number) {
    setFilters(filters.filter((_, i) => i !== index));
  }

  async function handleFilter() {
    if (texts.length === 0 || filters.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const response = await filterContent({ texts, filters });
      setResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">İçerik Filtreleme</h1>
        <p className="text-sm text-slate-500 mt-1">
          Metinlerinizi kişisel bilgi, küfür/şiddet, siyasi içerik gibi kategorilere göre tarayın
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="filter-input" className="text-sm font-semibold text-slate-700">
                Kontrol Edilecek Metinler
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={loadExamples}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors">
                  Örnek Yükle
                </button>
                <button type="button" onClick={handleReset}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors">
                  Sıfırla
                </button>
              </div>
            </div>
            <textarea
              id="filter-input"
              rows={10}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Her satıra bir metin girin..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
            />
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-2 inline-block">
              {texts.length} metin
            </span>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Filtre Kategorileri</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newFilter}
                onChange={(e) => setNewFilter(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFilter(); } }}
                placeholder="Yeni filtre ekle"
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button type="button" onClick={addFilter} disabled={!newFilter.trim()}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Ekle
              </button>
            </div>
            {filters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.map((filter, index) => (
                  <span key={index}
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-800">
                    {filter}
                    <button type="button" onClick={() => removeFilter(index)}
                      className="text-amber-400 hover:text-red-500 transition-colors">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button type="button" onClick={handleFilter}
            disabled={texts.length === 0 || filters.length === 0 || loading}
            className="w-full rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Taranıyor...
              </span>
            ) : "İçerik Taraması Başlat"}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">{results.length}</p>
              <p className="text-xs text-slate-500">Toplam Metin</p>
            </div>
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center">
              <p className="text-2xl font-bold text-red-700">{flaggedCount}</p>
              <p className="text-xs text-red-600">Bayraklanan</p>
            </div>
            <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{results.length - flaggedCount}</p>
              <p className="text-xs text-green-600">Temiz</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Detaylı Sonuçlar</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index}
                  className={`rounded-lg border p-4 ${result.is_flagged ? "border-red-200 bg-red-50/50" : "border-green-200 bg-green-50/50"}`}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="text-sm text-slate-800 flex-1">{result.text}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                      result.is_flagged
                        ? "bg-red-100 border-red-200 text-red-700"
                        : "bg-green-100 border-green-200 text-green-700"
                    }`}>
                      {result.is_flagged ? "Bayraklı" : "Temiz"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.matches.map((match, mi) => (
                      <span key={mi}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${
                          match.matched
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-slate-50 border-slate-200 text-slate-500"
                        }`}>
                        {match.filter_name}
                        <span className="font-mono text-[10px]">{formatScore(match.score)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
