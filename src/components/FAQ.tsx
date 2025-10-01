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
  return (
    <div id="faq" className="py-6 bg-gray-50">
      <h2 className="text-xl font-bold mb-4 text-center">よくある質問</h2>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-2">
          {faqData.map((faq) => (
            <div key={faq.id} className="bg-white p-3 md:p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center text-left">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">Q</span>
                {faq.question}
              </h3>
              <p className="text-gray-700 ml-9 text-left">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
