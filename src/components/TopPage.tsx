'use client';

export const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    // メインコンテンツエリアをスクロール
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // 念のためwindowもスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

