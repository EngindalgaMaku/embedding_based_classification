"use client";

interface TextInputProps {
  rawText: string;
  textCount: number;
  onRawTextChange: (raw: string) => void;
}

export default function TextInput({ rawText, textCount, onRawTextChange }: TextInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="text-input" className="text-sm font-semibold text-slate-700">
          Metinler
        </label>
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          {textCount} metin
        </span>
      </div>
      <textarea
        id="text-input"
        rows={8}
        value={rawText}
        onChange={(e) => onRawTextChange(e.target.value)}
        placeholder="Her satıra bir metin girin..."
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
      />
    </div>
  );
}
