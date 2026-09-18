'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MemberRecord } from '@/lib/users';

function formatDate(date: string) {
  const [, m, d] = date.split('-');
  return m && d ? `${Number(m)}/${Number(d)}` : date;
}

function RecordTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: MemberRecord }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const record = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg card-shadow px-3 py-1.5 text-xs">
      <p className="text-gray-500">{formatDate(record.date)}</p>
      <p className="font-medium text-gray-800">{record.result}</p>
    </div>
  );
}

export default function RecordGraph({ records }: { records: MemberRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl card-shadow p-5">
        <p className="text-sm font-bold text-blue-900 mb-2">記録グラフ</p>
        <p className="text-sm text-gray-400 text-center py-6">
          大会ページで記録を入力すると、ここにグラフが表示されます
        </p>
      </div>
    );
  }

  const byEvent = new Map<string, MemberRecord[]>();
  for (const r of records) {
    if (!byEvent.has(r.event)) byEvent.set(r.event, []);
    byEvent.get(r.event)!.push(r);
  }

  return (
    <div className="bg-white rounded-2xl card-shadow p-5 space-y-5">
      <p className="text-sm font-bold text-blue-900">記録グラフ</p>
      {Array.from(byEvent.entries()).map(([event, list]) => {
        const data = list
          .map((r) => ({ ...r, value: parseFloat(r.result) }))
          .filter((r) => !Number.isNaN(r.value));

        return (
          <div key={event} className="space-y-1">
            <p className="text-xs text-gray-500">{event}</p>
            {data.length === 0 ? (
              <p className="text-xs text-gray-400">数値として読み取れる記録がありません</p>
            ) : (
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                    <Tooltip content={<RecordTooltip />} />
                    <Line type="monotone" dataKey="value" stroke="#1e3a8a" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
