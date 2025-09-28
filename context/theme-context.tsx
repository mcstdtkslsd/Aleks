"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import useSound from "use-sound"

type ThemeContextType = {
  theme: string
  toggleTheme: () => void
}

type ThemeContextProviderProp = {
  children: React.ReactNode
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const ThemeContextProvider = ({ children }: ThemeContextProviderProp) => {
  const [theme, setTheme] = useState("dark")
  const [playLight] = useSound("/light-on.mp3", { volume: 0.5 })
  const [playDark] = useSound("/light-off.mp3", { volume: 0.5 })

  const toggleTheme = () => {
    // 禁用主题切换功能，保持黑色主题
  }

  useEffect(() => {
    // 强制设置为黑色主题
    setTheme("dark")
    document.documentElement.classList.add("dark")
    window.localStorage.setItem("theme", "dark")
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeContextProvider")
  }
  return context
}

export default ThemeContextProvider
