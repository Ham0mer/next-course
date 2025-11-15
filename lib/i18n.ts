import { useRouter } from 'next/router'
import zh from '../locales/zh.json'
import zhTw from '../locales/zh-tw.json'

const translations = { 
  zh, 
  'zh-tw': zhTw 
}

export type Locale = keyof typeof translations
export type TranslationKey = keyof typeof zh

export function useTranslation() {
  const router = useRouter()
  const locale = (router.locale || 'zh') as Locale
  const t = (key: TranslationKey) => translations[locale]?.[key] || translations.zh[key]

  return { t, locale }
} 