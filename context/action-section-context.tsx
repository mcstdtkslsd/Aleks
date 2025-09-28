'use client'

import React, {
  useState,
  createContext,
  SetStateAction,
  Dispatch,
  useContext,
} from "react"
import { links } from "@/lib/data"

// 动态从 links 获取 SectionName
export type SectionName = (typeof links)[number]["name"]

type ActionSectionContextProviderProps = {
  children: React.ReactNode
}

type ActionSectionContextType = {
  activeSection: SectionName
  setActiveSection: Dispatch<SetStateAction<SectionName>>
  timeOfLastClick: number
  setTimeOfLastClick: Dispatch<SetStateAction<number>>
}

const ActionSectionContext = createContext<ActionSectionContextType | null>(null)

export function ActionSectionContextProvider({
  children,
}: ActionSectionContextProviderProps) {
  const [activeSection, setActiveSection] = useState<SectionName>("Home")
  const [timeOfLastClick, setTimeOfLastClick] = useState(0)

  return (
    <ActionSectionContext.Provider
      value={{
        activeSection,
        setActiveSection,
        timeOfLastClick,
        setTimeOfLastClick,
      }}
    >
      {children}
    </ActionSectionContext.Provider>
  )
}

export function useActiveSectionContext() {
  const context = useContext(ActionSectionContext)
  if (!context) {
    throw new Error(
      "useActiveSectionContext must be used within a ActionSectionContextProvider"
    )
  }
  return context
}
