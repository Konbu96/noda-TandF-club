import { Fragment, ReactNode } from 'react';
import { getSpecialtyEvents, MemberRecord, UserRecord } from '@/lib/users';
import { bestRecordsByEvent } from '@/member-app/competition/events';

type Props = {
  profile: UserRecord;
  moodAvatar?: ReactNode;
  records?: MemberRecord[];
};

const rows = [
  { label: '学年', key: 'grade' },
  { label: '性別', key: 'gender' },
  { label: '所属ブロック', key: 'block' },
  { label: 'ゼッケン番号', key: 'bibNumber' },
  { label: '定期休養', key: 'restDay' },
] as const;

export default function MemberBasicInfo({ profile, moodAvatar, records }: Props) {
  const specialtyEvents = getSpecialtyEvents(profile);
  const pbList = bestRecordsByEvent(records ?? []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        {moodAvatar}
        <h2 className="text-lg font-bold text-blue-900">{profile.displayName || '未設定'}</h2>
      </div>
      <div className="divide-y">
        {rows.map(({ label, key }) => (
          <Fragment key={key}>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium">{profile[key] || '未設定'}</span>
            </div>
            {key === 'block' && (
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-500 shrink-0">専門種目</span>
                <span className="font-medium text-right">{specialtyEvents.join(' / ') || '未設定'}</span>
              </div>
            )}
          </Fragment>
        ))}
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-500 shrink-0">PB</span>
          {pbList.length === 0 ? (
            <span className="font-medium">未設定</span>
          ) : (
            <span className="font-medium text-right">
              {pbList.map((r) => (
                <span key={r.event} className="block">
                  {r.event}：{r.result}
                </span>
              ))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
