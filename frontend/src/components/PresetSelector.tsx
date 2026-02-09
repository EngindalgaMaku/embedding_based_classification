"use client";

import { PRESETS, Preset } from "@/lib/presets";

interface PresetSelectorProps {
  onSelect: (preset: Preset) => void;
  onReset: () => void;
}

export default function PresetSelector({ onSelect, onReset }: PresetSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Örnek Veri Setleri</label>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => onSelect(preset)}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors"
          >
            {preset.name}
          </button>
        ))}
        <button
          type="button"
          onClick={onReset}
          className="rounded border border-red-300 bg-white px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors"
        >
          Sıfırla
        </button>
      </div>
    </div>
  );
}
