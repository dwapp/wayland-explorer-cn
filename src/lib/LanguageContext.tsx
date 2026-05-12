import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'zh'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('language') : null
        return (saved as Language) || 'zh'
    })

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('language', lang)
        }
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
