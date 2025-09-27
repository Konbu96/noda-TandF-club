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
    answer: "はい、大丈夫です！多くの部員が初心者からスタートしています。基礎から丁寧に指導しますので、安心してご参加ください。"
  },
  {
    id: 2,
    question: "練習はどのくらいの頻度で行われますか？",
    answer: "平日は週4日、土曜日も練習があります。日曜日は基本的に休みですが、大会前などは調整練習を行う場合があります。"
  },
  {
    id: 3,
    question: "勉強との両立は可能ですか？",
    answer: "はい、可能です！練習時間は限られているので、効率的に時間を使う習慣が身につきます。部員の多くが勉強も頑張っています。"
  },
  {
    id: 4,
    question: "必要な道具や費用はありますか？",
    answer: "基本的にはシューズとウェアが必要です。学校指定のものもありますが、最初は体験入部で様子を見ていただいても構いません。"
  },
  {
    id: 5,
    question: "大会への参加は必須ですか？",
    answer: "参加は強制ではありませんが、目標を持つことで練習のモチベーションが上がります。自分のペースで参加できる大会を選べます。"
  },
  {
    id: 6,
    question: "怪我をした場合はどうなりますか？",
    answer: "怪我をした場合は、無理をせずに休養を取ることが大切です。復帰時は段階的に練習を再開し、医師の指示に従って進めます。"
  },
  {
    id: 7,
    question: "先輩後輩の関係はどうですか？",
    answer: "上下関係はありますが、お互いを尊重し合える関係です。先輩は後輩の面倒を見て、後輩は先輩から多くのことを学べます。"
  }
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleFaqClick = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div id="faq" className="p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-center">よくある質問</h2>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={faq.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => handleFaqClick(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">Q</span>
                  {faq.question}
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 ml-9">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
