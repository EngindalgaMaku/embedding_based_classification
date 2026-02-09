"use client";

import { useState } from "react";

interface CategoryManagerProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export default function CategoryManager({
  categories,
  onCategoriesChange,
}: CategoryManagerProps) {
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
      <label className="block text-sm font-medium mb-2">Kategoriler</label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Kategori adı girin"
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ekle
        </button>
      </div>
      <ul className="space-y-1">
        {categories.map((category, index) => (
          <li
            key={index}
            className="flex items-center justify-between rounded border border-gray-200 px-3 py-2 text-sm"
          >
            <span>{category}</span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              aria-label={`${category} kategorisini sil`}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
