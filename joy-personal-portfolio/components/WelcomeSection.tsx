"use client"

import React from 'react';
import { useTranslations } from 'next-intl';

const WelcomeSection = () => {
  const t = useTranslations('WelcomeSection');
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-4xl mb-4">{t('welcome')}</h1>
      {/* 动态效果交互代码可以在这里添加 */}
    </div>
  );
};

export default WelcomeSection;