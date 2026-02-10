"use client";

import { ClassificationResult } from "@/lib/api";
import { formatScore } from "@/lib/utils";

interface ResultsTableProps {
  results: ClassificationResult[];
}

export default function ResultsTable({ results }: ResultsTableProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Sonuçlar</h3>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {results.length} metin sınıflandırıldı
        </span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Metin</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Skor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((result, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2.5 text-slate-800 max-w-xs truncate">{result.text}</td>
                <td className="px-4 py-2.5">
                  <span className="inline-block rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                    {result.category}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-slate-600">
                  {formatScore(result.similarity_score)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
