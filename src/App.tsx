import { useState } from 'react'
import Header from './components/Header'
import MapView from './components/MapView'
import SpotCard from './components/SpotCard'
import spotsData from './data/spots.json'
import type { Lang, Spot } from './types'

const spots = spotsData as Spot[]

export default function App() {
  const [lang, setLang] = useState<Lang>('ja')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedSpot = spots.find((s) => s.id === selectedId) ?? null

  const handleTodaysPick = () => {
    const candidates = spots.filter((s) => s.id !== selectedId)
    const pool = candidates.length > 0 ? candidates : spots
    const pick = pool[Math.floor(Math.random() * pool.length)]
    setSelectedId(pick.id)
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <MapView spots={spots} lang={lang} selectedId={selectedId} onSelect={setSelectedId} />
      <Header lang={lang} onLangChange={setLang} onTodaysPick={handleTodaysPick} />
      {selectedSpot && (
        <SpotCard spot={selectedSpot} lang={lang} onClose={() => setSelectedId(null)} />
      )}
    </div>
  )
}
