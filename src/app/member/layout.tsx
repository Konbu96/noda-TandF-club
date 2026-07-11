import BottomNav from '@/member-app/layout/BottomNav';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <header className="bg-blue-900 text-white px-4 py-3">
        <h1 className="text-base font-bold">野田学園陸上競技部</h1>
      </header>
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}
