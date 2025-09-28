import React from 'react';
import { useTranslations } from 'next-intl';

const SkillsSection = () => {
  const t = useTranslations('SkillsSection');

  return (
    <section className="flex flex-col items-center justify-center bg-black text-white py-10">
      <h2 className="text-4xl mb-6">{t('title')}</h2>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9">
        {/* 技能标签 */}
        <div className="bg-gray-800 rounded px-4 py-2">Unity</div>
        <div className="bg-gray-800 rounded px-4 py-2">Blender </div>
        <div className="bg-gray-800 rounded px-4 py-2">AE</div>
        <div className="bg-gray-800 rounded px-4 py-2">PS</div>
        <div className="bg-gray-800 rounded px-4 py-2">AI</div>
        <div className="bg-gray-800 rounded px-4 py-2">剪映</div>
        <div className="bg-gray-800 rounded px-4 py-2">Figma</div>
        <div className="bg-gray-800 rounded px-4 py-2">Arduino</div>
        <div className="bg-gray-800 rounded px-4 py-2">UI/UX</div>
      </div>
    </section>
  );
};

export default SkillsSection;