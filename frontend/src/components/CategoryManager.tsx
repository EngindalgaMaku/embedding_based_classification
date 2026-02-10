"use client";

import { useState } from "react";

interface CategoryManagerProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export default function CategoryManager({ categories, onCategoriesChange }: CategoryManagerProps) {
  const [inputValue, setInputValue] = useState("");

  function handleAdd() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onCategoriesChange([...categories, trimmed]);
    setInputValue("");
  }

  function handleRemove(index: number) {
    onCategoriesChange(categories.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">Kategoriler</label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Kategori adı girin"
          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Ekle
        </button>
      </div>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
            >
              {category}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label={`${category} kategorisini sil`}
                className="text-indigo-400 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
