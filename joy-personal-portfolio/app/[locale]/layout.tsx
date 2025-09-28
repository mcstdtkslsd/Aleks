import Header from "@/components/Header"
import "./globals.css"
import { Inter } from "next/font/google"
import ThemeContextProvider from "@/context/theme-context"
import { ActionSectionContextProvider } from "@/context/action-section-context"
import Footer from "@/components/Footer"
import ThemeSwitch from "@/components/ThemeTwich"
// import { usePathname } from "next/navigation"
import { NextIntlClientProvider, useMessages } from "next-intl"
import WidgetWrapper from "@/components/WidgetWrapper"
import SplashCursor from "@/components/SplashCursor"
import Aurora from "@/components/Aurora"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = useMessages()
  // const pathname = usePathname()
  // const isProjectDetail = pathname.includes("projects")
  return (
    <html lang={locale} className="!scroll-smooth">
      <body
        className={`${inter.className} bg-black text-gray-955 relative dark:bg-black dark:text-gray-50 dark:text-opacity-90`}
      >
        {/* 添加极光效果作为页面顶部内容的一部分 */}
        <div className="aurora-container absolute top-0 left-0 w-full h-[40vh] overflow-hidden -z-10">
          <Aurora
            colorStops={['#00fff0', '#8000ff', '#001f3f']} // 抖音风格的深蓝色和紫色搭配
            amplitude={1.5}
            blend={0.8}
            speed={1.2}
            intensity={1.2}
            className="w-full h-full"
          />
        </div>

        {/* 其他现有内容 */}
        <div className="bg-[#fbe2e3] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#5b3b3c]"></div>
        <div className="bg-[#dbd7fb] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#433f68]"></div>

        <NextIntlClientProvider messages={messages}>
          <ThemeContextProvider>
            <ActionSectionContextProvider>
              <Header />
              {children}
              <Footer />
              <WidgetWrapper>
                <ThemeSwitch />
              </WidgetWrapper>
              <SplashCursor 
                SIM_RESOLUTION={128}
                DYE_RESOLUTION={1440}
                CAPTURE_RESOLUTION={512}
                DENSITY_DISSIPATION={3.5}
                VELOCITY_DISSIPATION={2}
                PRESSURE={0.1}
                PRESSURE_ITERATIONS={20}
                CURL={3}
                SPLAT_RADIUS={0.2}
                SPLAT_FORCE={6000}
                SHADING={true}
                COLOR_UPDATE_SPEED={10}
                BACK_COLOR={{ r: 0.5, g: 0, b: 0 }}
                TRANSPARENT={true}
              />
            </ActionSectionContextProvider>
          </ThemeContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}