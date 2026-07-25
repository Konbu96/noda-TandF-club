const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

export function today(): string {
  return new Date()
    .toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\//g, '-');
}

export function formatDateWithWeekday(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const weekday = WEEKDAY_LABELS[new Date(y, m - 1, d).getDay()];
  return `${m}/${d}(${weekday})`;
}
