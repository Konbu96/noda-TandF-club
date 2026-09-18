import { Zen_Maru_Gothic } from 'next/font/google';
import MemberShell from '@/member-app/layout/MemberShell';

const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={zenMaruGothic.className}>
      <MemberShell>{children}</MemberShell>
    </div>
  );
}
