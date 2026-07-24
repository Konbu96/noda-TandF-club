'use client';

import { useState } from 'react';
import { TemplateSpec } from './types';

const NUMS = Array.from({ length: 10 }, (_, i) => i + 1);

type Values = (string | string[])[];

function initValues(spec: TemplateSpec): Values {
  return spec.parts.map((p) => {
    if (p.kind === 'fixed') return p.text;
    if (p.kind === 'multicheck') return [];
    return '';
  });
}

function composeNote(spec: TemplateSpec, values: Values): string {
  return spec.parts
    .map((part, i) => {
      if (part.kind === 'fixed') return part.text;
      if (part.kind === 'multicheck') {
        const arr = values[i] as string[];
        return arr.length ? arr.join(part.separator ?? '＆') : '';
      }
      if (part.kind === 'number') {
        const n = values[i] as string;
        return n ? `${part.prefix ?? ''}${n}${part.suffix}` : '';
      }
      if (part.kind === 'select') return values[i] as string;
      return '';
    })
    .filter(Boolean)
    .join('　');
}

export default function ItemOptions({
  spec,
  onChange,
}: {
  spec: TemplateSpec;
  onChange: (note: string) => void;
}) {
  const [values, setValues] = useState<Values>(() => initValues(spec));

  const update = (i: number, val: string | string[]) => {
    const next = values.map((v, idx) => (idx === i ? val : v));
    setValues(next);
    onChange(composeNote(spec, next));
  };

  const hasInteractive = spec.parts.some((p) => p.kind !== 'fixed');

  return (
    <div className="ml-8 mt-1 mb-2 p-3 bg-gray-50 rounded-xl space-y-3">
      {!hasInteractive && (
        <p className="text-xs text-gray-400">自動的に追加されます</p>
      )}
      {spec.parts.map((part, i) => {
        if (part.kind === 'fixed') return null;

        if (part.kind === 'multicheck') {
          const selected = values[i] as string[];
          return (
            <div key={i} className="flex flex-wrap gap-2">
              {part.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const next = selected.includes(opt)
                      ? selected.filter((s) => s !== opt)
                      : [...selected, opt];
                    update(i, next);
                  }}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    selected.includes(opt)
                      ? 'bg-sky-100 text-sky-700 border-sky-300'
                      : 'bg-white text-gray-600 border-gray-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          );
        }

        if (part.kind === 'select') {
          const selected = values[i] as string;
          return (
            <div key={i} className="flex flex-wrap gap-2">
              {part.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => update(i, selected === opt ? '' : opt)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    selected === opt
                      ? 'bg-sky-100 text-sky-700 border-sky-300'
                      : 'bg-white text-gray-600 border-gray-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          );
        }

        if (part.kind === 'number') {
          const selected = values[i] as string;
          const label = part.prefix ? `${part.prefix}（${part.suffix}）` : part.suffix;
          return (
            <div key={i} className="space-y-1">
              <p className="text-xs text-gray-500">{label}</p>
              <div className="flex flex-wrap gap-1">
                {NUMS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => update(i, selected === String(n) ? '' : String(n))}
                    className={`w-8 h-8 text-xs rounded-full border transition-colors ${
                      selected === String(n)
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
