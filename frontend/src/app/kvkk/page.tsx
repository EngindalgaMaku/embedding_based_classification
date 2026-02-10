"use client";

import { useState } from "react";
import { classify, ClassificationResult } from "@/lib/api";
import { formatScore } from "@/lib/utils";

const KVKK_CATEGORIES = [
  "Kişisel Veri İçerir",
  "Kişisel Veri İçermez",
];

export default function KvkkPage() {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const EXAMPLE_TEXTS = [
    "Ahmet Yılmaz'ın TC kimlik numarası 12345678901'dir.",
    "Bugün hava çok güzel, parkta yürüyüş yaptık.",
    "Hasta Ayşe Demir'in kan grubu A Rh+ olarak tespit edildi.",
    "Şirketimiz 2024 yılında %15 büyüme kaydetti.",
    "Müşteri telefon numarası 0532 123 45 67 olarak güncellendi.",
    "Yeni ürün lansmanı önümüzdeki ay yapılacak.",
    "Çalışan maaş bilgisi: 45.000 TL net, IBAN: TR12 0001 0002 0003.",
    "Toplantı salonu yarın 14:00'te müsait.",
  ];

  function loadExamples() {
    setInputText(EXAMPLE_TEXTS.join("\n"));
    setResults([]);
    setError(null);
  }

  function handleReset() {
    setInputText("");
    setResults([]);
    setError(null);
  }

  async function handleCheck() {
    const texts = inputText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    if (texts.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      const response = await classify({ texts, categories: KVKK_CATEGORIES });
      setResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const texts = inputText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const hasPersonalData = results.filter(r => r.category === "Kişisel Veri İçerir");

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">KVKK Kişisel Veri Kontrolü</h1>
        <p className="text-sm text-slate-500 mt-1">
          Metinlerinizde kişisel veri bulunup bulunmadığını zero-shot sınıflandırma ile tespit edin
        </p>
      </div>

      <div className="space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="kvkk-input" className="text-sm font-semibold text-slate-700">
              Kontrol Edilecek Metinler
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={loadExamples}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
              >
                Örnek Yükle
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
              >
                Sıfırla
              </button>
            </div>
          </div>
          <textarea
            id="kvkk-input"
            rows={8}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Her satıra bir metin girin..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {texts.length} metin
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheck}
          disabled={texts.length === 0 || loading}
          className="w-full rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Kontrol Ediliyor...
            </span>
          ) : "KVKK Kontrolü Başlat"}
        </button>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            {hasPersonalData.length > 0 && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <p className="text-sm font-semibold text-red-800">
                  ⚠️ {hasPersonalData.length} / {results.length} metinde kişisel veri tespit edildi
                </p>
              </div>
            )}
            {hasPersonalData.length === 0 && (
              <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                <p className="text-sm font-semibold text-green-800">
                  ✓ Hiçbir metinde kişisel veri tespit edilmedi
                </p>
              </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Detaylı Sonuçlar</h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Metin</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Durum</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Skor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((result, index) => {
                      const isPersonal = result.category === "Kişisel Veri İçerir";
                      return (
                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-2.5 text-slate-800 max-w-sm truncate">{result.text}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                              isPersonal
                                ? "bg-red-50 border-red-200 text-red-700"
                                : "bg-green-50 border-green-200 text-green-700"
                            }`}>
                              {isPersonal ? "Kişisel Veri" : "Temiz"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono text-slate-600">
                            {formatScore(result.similarity_score)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
