import { ReactNode } from 'react';
import { UserRecord } from '@/lib/users';

type Props = {
  profile: UserRecord;
  moodAvatar?: ReactNode;
};

const rows = [
  { label: '学年', key: 'grade' },
  { label: '性別', key: 'gender' },
  { label: '所属ブロック', key: 'block' },
  { label: '専門種目', key: 'event' },
  { label: 'ゼッケン番号', key: 'bibNumber' },
  { label: '定期休養', key: 'restDay' },
] as const;

export default function MemberBasicInfo({ profile, moodAvatar }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        {moodAvatar}
        <h2 className="text-lg font-bold text-blue-900">{profile.displayName || '未設定'}</h2>
      </div>
      <div className="divide-y">
        {rows.map(({ label, key }) => (
          <div key={key} className="flex justify-between py-2 text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium">{profile[key] || '未設定'}</span>
          </div>
        ))}
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-500">PB</span>
          <span className="font-medium whitespace-pre-wrap text-right">{profile.pb || '未設定'}</span>
        </div>
      </div>
    </div>
  );
}
