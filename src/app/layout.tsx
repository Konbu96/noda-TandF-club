import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { GoogleAnalytics } from "@next/third-parties/google";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "野田学園陸上競技部",
  description: "中学生から高校生まで、男女問わず仲良く一緒に活動しています。短距離から長距離、跳躍・投擲まで幅広く取り組んでいます。",
  openGraph: {
    title: "野田学園陸上競技部",
    description: "中学生から高校生まで、男女問わず仲良く一緒に活動しています。短距離から長距離、跳躍・投擲まで幅広く取り組んでいます。",
    url: "noda-tandf-club.vercel.app", 
    siteName: "野田学園陸上競技部",
    images: [
      {
        url: "/img/ogp.jpg", // OGP画像のパス
        width: 1200,
        height: 630,
        alt: "野田学園陸上競技部",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "野田学園陸上競技部",
    description: "中学生から高校生まで、男女問わず仲良く一緒に活動しています。短距離から長距離、跳躍・投擲まで幅広く取り組んでいます。",
    images: ["/img/ogp.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="bg-white">
      <body
        className={`${notoSansJP.variable} ${notoSerifJP.variable} antialiased`}
      >
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto pt-16">
            {children}
          </main>
        </div>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
