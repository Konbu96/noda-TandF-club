'use client';

import { useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MemberRecord } from '@/lib/users';

type Props = {
  records: MemberRecord[];
  event: string;
};

export default function RecordGraph({ records, event }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = containerRef.current?.querySelector('svg');
    if (svg) {
      svg.style.outline = 'none';
      svg.setAttribute('tabindex', '-1');
    }
  }, []);

  const data = records
    .filter((r) => r.event === event)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => ({ date: r.date, result: r.result, competition: r.competition }));

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-5 text-center text-sm text-gray-400">
        記録がまだありません
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h3 className="text-sm font-bold text-blue-900 mb-4">{event} 記録推移</h3>
      <div ref={containerRef} style={{ WebkitTapHighlightColor: 'transparent' }}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="result" stroke="#1e3a8a" strokeWidth={2} dot={{ r: 4 }} activeDot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
