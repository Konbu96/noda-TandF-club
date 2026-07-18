import MemberShell from '@/member-app/layout/MemberShell';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return <MemberShell>{children}</MemberShell>;
}
