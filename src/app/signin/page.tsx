import SignInForm from '@/member-app/auth/SignInForm';

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900 px-6">
      <h1 className="text-white text-2xl font-bold mb-2">野田学園陸上競技部</h1>
      <p className="text-blue-200 text-sm mb-8">部員ログイン</p>
      <SignInForm />
    </div>
  );
}
