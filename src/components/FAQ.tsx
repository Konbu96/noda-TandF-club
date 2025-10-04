'use client';

import { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "陸上競技の経験がなくても入部できますか？",
    answer: "はい、大丈夫です！陸上経験者も未経験者も所属しています。"
  },
  {
    id: 2,
    question: "練習はどのくらいの頻度で行われますか？",
    answer: "平日は週5日、土曜日も練習があります。中学生のみ平日週4日です。"
  },
  {
    id: 3,
    question: "勉強との両立は可能ですか？",
    answer: "はい、可能です！陸上部にも特進クラスの生徒や、医進コースの生徒が所属しています。"
  },
  {
    id: 4,
    question: "必要な道具や費用はありますか？",
    answer: "基本的にはユニフォームとシューズのみです。"
  }
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleFaqClick = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div id="faq" className="py-6 px-4 md:py-8 bg-gray-50">
      <h2 className="text-xl font-bold mb-4 text-center">よくある質問</h2>
      <div className="max-w-6xl mx-auto">
        <div className="space-y-2">
          {faqData.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <button
                onClick={() => handleFaqClick(faq.id)}
                className="w-full p-3 md:p-6 text-left"
              >
                <h3 className="font-semibold text-gray-900 flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">Q</span>
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 md:hidden ${openFaq === faq.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </h3>
              </button>
              <div className={`md:block ${openFaq === faq.id ? 'block' : 'hidden'}`}>
                <p className="text-gray-700 ml-3 md:ml-9 pb-3 md:pb-6 pr-3 md:pr-6 text-left">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
