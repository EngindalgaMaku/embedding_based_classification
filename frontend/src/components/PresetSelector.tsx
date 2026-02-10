"use client";

import { PRESETS, Preset } from "@/lib/presets";

interface PresetSelectorProps {
  onSelect: (preset: Preset) => void;
  onReset: () => void;
}

export default function PresetSelector({ onSelect, onReset }: PresetSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-3">Örnek Veri Setleri</label>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => onSelect(preset)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
          >
            {preset.name}
          </button>
        ))}
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
        >
          Sıfırla
        </button>
      </div>
    </div>
  );
}
