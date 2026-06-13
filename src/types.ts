export type Lang = 'ja' | 'en'

export interface LocalizedText {
  ja: string
  en: string
}

export interface Spot {
  id: string
  name: LocalizedText
  category: LocalizedText
  emoji: string
  lat: number
  lng: number
  trivia: LocalizedText
  bestTime: LocalizedText
  bestTimeType: 'time' | 'season'
}
