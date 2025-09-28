"use client"

import React from "react"
import { headerLanguageMap, skillsData } from "@/lib/data"
import { useSectionInView } from "@/lib/hooks"
import { motion } from "framer-motion"
import SectionHeading from "./SectionHeading"
import { useLocale } from "next-intl"

// Framer Motion 动画配置
const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
    },
  }),
}

export default function Skills() {
  // 使用自定义 hook 监听滚动进入视口
  const { ref } = useSectionInView("Skills")
  const activeLocale = useLocale()

  return (
    <section
      id="skills"
      ref={ref}
      className="max-w-[53rem] scroll-mt-28 text-center mb-40"
    >
      <SectionHeading>
        {activeLocale === "zh"
          ? headerLanguageMap["Skills"]
          : "My Skills"}
      </SectionHeading>
      <ul className="flex flex-wrap justify-center items-center gap-2 text-lg text-gray-800">
        {skillsData.map((skill, index) => (
          <motion.li
            key={index}
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            custom={index}
            className="bg-white borderBlack rounded-xl px-5 py-3 dark:bg-white/10 dark:text-white/80 flex items-center justify-center"
          >
            {skill}
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
