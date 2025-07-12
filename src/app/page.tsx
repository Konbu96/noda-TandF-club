import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-[50px] text-blue-900 font-bold mb-0">
        NODA-Track&Field-club
      </h1>
      <h2 className="text-[40px] text-blue-500 mt-0">
        部活風景
      </h2>
    </div>
  );
}
