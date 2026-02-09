"use client";

import { parseTexts } from "@/lib/utils";

interface TextInputProps {
  texts: string[];
  onTextsChange: (texts: string[]) => void;
}

export default function TextInput({ texts, onTextsChange }: TextInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onTextsChange(parseTexts(e.target.value));
  }

  return (
    <div>
      <label htmlFor="text-input" className="block text-sm font-medium mb-2">
        Metinler
      </label>
      <textarea
        id="text-input"
        rows={6}
        onChange={handleChange}
        placeholder="Her satıra bir metin girin..."
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="mt-1 text-xs text-gray-500">
        {texts.length} metin girildi
      </p>
    </div>
  );
}
