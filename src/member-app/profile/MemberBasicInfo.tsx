import { MemberProfile } from './types';

type Props = {
  profile: MemberProfile;
};

const rows = [
  { label: '学年', key: 'grade' },
  { label: '性別', key: 'gender' },
  { label: '所属ブロック', key: 'block' },
  { label: '専門種目', key: 'event' },
  { label: 'ゼッケン番号', key: 'bibNumber' },
  { label: '定期休養', key: 'restDay' },
] as const;

export default function MemberBasicInfo({ profile }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h2 className="text-lg font-bold text-blue-900 mb-1">{profile.name}</h2>
      <div className="divide-y">
        {rows.map(({ label, key }) => (
          <div key={key} className="flex justify-between py-2 text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium">{profile[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
