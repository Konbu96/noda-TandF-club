'use client';

interface PieChartProps {
  title: string;
  total: number;
  segments: {
    label: string;
    value: number;
    color: string;
    percentage: number;
  }[];
}

export default function PieChart({ title, total, segments }: PieChartProps) {
  let currentOffset = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="rounded-lg border border-gray-200 p-5">
      <h3 className="text-lg font-bold mb-4 text-center">{title}</h3>
      <div className="flex justify-center items-center">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {segments.map((segment, index) => {
              const dashArray = `${circumference * segment.percentage} ${circumference}`;
              const dashOffset = -currentOffset;
              currentOffset += circumference * segment.percentage;
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="8"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold">{total}人</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: segment.color }}></div>
            <span className="text-xs md:text-sm">{segment.label} {segment.value}人</span>
          </div>
        ))}
      </div>
    </div>
  );
}

