"use client";

import { ClassificationResult } from "@/lib/api";
import { formatScore } from "@/lib/utils";

interface ResultsTableProps {
  results: ClassificationResult[];
}

export default function ResultsTable({ results }: ResultsTableProps) {
  return (
    <div>
      <p className="mb-2 text-sm text-gray-600">
        Toplam sınıflandırılan metin: {results.length}
      </p>
      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Metin</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Kategori</th>
              <th className="px-4 py-2 text-right font-medium text-gray-700">Benzerlik Skoru</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className="border-t border-gray-100">
                <td className="px-4 py-2 text-gray-900">{result.text}</td>
                <td className="px-4 py-2 text-gray-700">{result.category}</td>
                <td className="px-4 py-2 text-right font-mono text-gray-700">
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
