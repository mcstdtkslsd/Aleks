import Intro from "@/components/Intro"
import SectionDivider from "@/components/SectionDivider"
import About from "@/components/About"
import Projects from "@/components/Projects"
import Skills from "@/components/SkillsSection";
import Experience from "@/components/Experience"
import { isMobileDevice } from "@/lib/utils"

export default function Home() {
  const isMobile = isMobileDevice()

  return (
    <main className="flex flex-col items-center justify-center px-4 overflow-x-hidden">
      <Intro />
      <SectionDivider />
      <About />
      <Projects />
      <Skills />
      <Experience isMobile={isMobile} />
      {/* <Contact /> */}
    </main>
  )
}

// export async function generateStaticParams() {
//   // 这里返回你项目中实际支持的语言，比如只支持中文
//   return [{ locale: 'zh' }];
  
//   // 如果支持多种语言，比如中英文，这样写：
//   // return [{ locale: 'zh' }, { locale: 'en' }];
// }