'use client';

import { useState } from 'react';
import { CustomOption } from './types';

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function CustomItemOptions({
  options = [],
  onChange,
}: {
  options: CustomOption[];
  onChange: (options: CustomOption[], note: string) => void;
}) {
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');

  const emit = (next: CustomOption[]) => {
    const note = next.filter((o) => o.selected).map((o) => o.label).join('＆');
    onChange(next, note);
  };

  const addOption = () => {
    if (!input.trim()) return;
    emit([...options, { id: newId(), label: input.trim(), selected: true }]);
    setInput('');
  };

  const toggleSelect = (id: string) =>
    emit(options.map((o) => (o.id === id ? { ...o, selected: !o.selected } : o)));

  const startEdit = (o: CustomOption) => {
    setEditingId(o.id);
    setEditingLabel(o.label);
  };

  const confirmEdit = (id: string) => {
    if (editingLabel.trim()) {
      emit(options.map((o) => (o.id === id ? { ...o, label: editingLabel.trim() } : o)));
    }
    setEditingId(null);
  };

  const removeOption = (id: string) =>
    emit(options.filter((o) => o.id !== id));

  return (
    <div className="ml-8 mt-1 mb-2 p-3 bg-gray-50 rounded-xl space-y-2">
      {/* 追加済み項目 */}
      {options.map((o) => (
        <div key={o.id} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleSelect(o.id)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors flex-1 text-left ${
              o.selected
                ? 'bg-sky-100 text-sky-700 border-sky-300'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            {editingId === o.id ? (
              <input
                autoFocus
                value={editingLabel}
                onChange={(e) => setEditingLabel(e.target.value)}
                onBlur={() => confirmEdit(o.id)}
                onKeyDown={(e) => e.key === 'Enter' && confirmEdit(o.id)}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent outline-none w-full"
              />
            ) : (
              o.label
            )}
          </button>
          <button
            type="button"
            onClick={() => startEdit(o)}
            className="text-gray-400 text-xs px-1"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => removeOption(o.id)}
            className="text-gray-400 text-xs px-1"
          >
            ✕
          </button>
        </div>
      ))}

      {/* 新規追加 */}
      <div className="flex gap-2 pt-1">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addOption()}
          placeholder="項目を追加..."
          className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-900"
        />
        <button
          type="button"
          onClick={addOption}
          className="text-xs bg-blue-900 text-white px-3 py-1.5 rounded-lg"
        >
          追加
        </button>
      </div>
    </div>
  );
}
