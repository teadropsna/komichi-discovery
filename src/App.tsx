import { useState } from 'react'
import Header from './components/Header'
import MapView from './components/MapView'
import spotsData from './data/spots.json'
import type { Lang, Spot } from './types'

const spots = spotsData as Spot[]

export default function App() {
  const [lang, setLang] = useState<Lang>('ja')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <MapView spots={spots} lang={lang} selectedId={selectedId} onSelect={setSelectedId} />
      <Header lang={lang} onLangChange={setLang} />
    </div>
  )
}
