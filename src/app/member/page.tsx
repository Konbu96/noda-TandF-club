'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/member-app/auth/AuthContext';
import { db } from '@/lib/firebase';
import { MemberProfile, Record } from '@/member-app/profile/types';
import MemberBasicInfo from '@/member-app/profile/MemberBasicInfo';
import RecordGraph from '@/member-app/profile/RecordGraph';

export default function MemberPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/noda-members');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const profileSnap = await getDoc(doc(db, 'members', user.uid));
      if (profileSnap.exists()) {
        setProfile(profileSnap.data() as MemberProfile);
      }

      const recordsSnap = await getDocs(
        query(collection(db, 'records'), where('userId', '==', user.uid))
      );
      setRecords(recordsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Record)));
    };

    fetchData();
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 space-y-4">
      <h1 className="text-lg font-bold text-blue-900">マイページ</h1>
      {profile ? (
        <>
          <MemberBasicInfo profile={profile} />
          <RecordGraph records={records} event={profile.event} />
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow p-5 text-sm text-gray-400 text-center">
          プロフィールが登録されていません
        </div>
      )}
    </div>
  );
}
