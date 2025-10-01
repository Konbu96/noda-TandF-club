'use client';

import { useState } from 'react';

export default function ExperienceForm() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors duration-200 flex items-center justify-center"
      >
        <span>体験入部申し込み</span>
        <svg
          className={`w-5 h-5 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-none opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="w-full overflow-hidden">
            <div className="transform scale-90 origin-top-left" style={{width: '111.11%'}}>
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSctzeabTK_hclqT1ZB7BfJ-h3f7hABN8Ffzx7tuDSrjhuAiUg/viewform?embedded=true"
                width="100%"
                height="600"
                className="w-full rounded-lg"
                title="体験入部申し込みフォーム"
              >
                読み込んでいます…
              </iframe>
            </div>
          </div>
        </div>
      </div>                    
    </div>
  );
}
