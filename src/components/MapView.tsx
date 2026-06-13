import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Lang, Spot } from '../types'

interface Props {
  spots: Spot[]
  lang: Lang
  selectedId: string | null
  onSelect: (id: string | null) => void
}

const style: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
}

const POPUP_COPY = {
  ja: { bestTime: 'おすすめの時間帯', bestSeason: 'おすすめの時期' },
  en: { bestTime: 'Best time to visit', bestSeason: 'Best season to visit' },
}

function buildPopupContent(spot: Spot, lang: Lang): HTMLElement {
  const t = POPUP_COPY[lang]
  const bestTimeLabel = spot.bestTimeType === 'season' ? t.bestSeason : t.bestTime

  const container = document.createElement('div')
  container.className = 'p-1 max-w-[260px]'
  container.innerHTML = `
    <div class="flex items-center gap-2 mb-2">
      <span class="text-xl">${spot.emoji}</span>
      <div>
        <p class="font-bold text-stone-800 leading-tight">${spot.name[lang]}</p>
        <p class="text-xs text-orange-500">${spot.category[lang]}</p>
      </div>
    </div>
    <div class="bg-orange-50 rounded-lg p-2 mb-2">
      <p class="text-sm text-stone-700 leading-relaxed">${spot.trivia[lang]}</p>
    </div>
    <div class="flex items-center gap-1.5 text-xs text-stone-500">
      <span>🕒</span>
      <span>${bestTimeLabel}: ${spot.bestTime[lang]}</span>
    </div>
  `
  return container
}

export default function MapView({ spots, lang, selectedId, onSelect }: Props) {
  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerElsRef = useRef<Record<string, HTMLDivElement>>({})
  const popupRef = useRef<maplibregl.Popup | null>(null)
  const suppressCloseRef = useRef(false)

  useEffect(() => {
    if (!mapDivRef.current) return

    const bounds = spots.reduce(
      (b, s) => b.extend([s.lng, s.lat]),
      new maplibregl.LngLatBounds([spots[0].lng, spots[0].lat], [spots[0].lng, spots[0].lat])
    )

    const map = new maplibregl.Map({
      container: mapDivRef.current,
      style,
      bounds,
      fitBoundsOptions: { padding: 60 },
      canvasContextAttributes: { preserveDrawingBuffer: true },
      attributionControl: false,
    })
    mapRef.current = map

    map.addControl(new maplibregl.AttributionControl({ compact: false }), 'bottom-right')

    map.on('error', (e) => {
      console.error('[Komichi] MapLibre error:', e.error)
    })

    // コンテナのサイズ変化（flexレイアウト確定など）に追従してリサイズ
    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(mapDivRef.current)

    spots.forEach((spot) => {
      const el = document.createElement('div')
      el.style.width = '36px'
      el.style.height = '36px'
      el.style.borderRadius = '50%'
      el.style.display = 'flex'
      el.style.alignItems = 'center'
      el.style.justifyContent = 'center'
      el.style.fontSize = '18px'
      el.style.background = '#fff'
      el.style.border = '2px solid #FB923C'
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)'
      el.style.cursor = 'pointer'
      el.style.transition = 'transform 0.2s ease'
      el.textContent = spot.emoji

      el.addEventListener('click', (e) => {
        e.stopPropagation()
        onSelect(spot.id)
      })

      new maplibregl.Marker({ element: el }).setLngLat([spot.lng, spot.lat]).addTo(map)
      markerElsRef.current[spot.id] = el
    })

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 選択中のスポットをマーカーの見た目・吹き出し・カメラに反映
  useEffect(() => {
    Object.entries(markerElsRef.current).forEach(([id, el]) => {
      if (id === selectedId) {
        el.style.transform = 'scale(1.3)'
        el.style.borderColor = '#EA580C'
        el.style.zIndex = '10'
      } else {
        el.style.transform = 'scale(1)'
        el.style.borderColor = '#FB923C'
        el.style.zIndex = '0'
      }
    })

    const map = mapRef.current
    if (!map) return

    if (popupRef.current) {
      suppressCloseRef.current = true
      popupRef.current.remove()
      popupRef.current = null
    }

    if (!selectedId) return
    const spot = spots.find((s) => s.id === selectedId)
    if (!spot) return

    const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true, offset: 22, maxWidth: '280px' })
      .setLngLat([spot.lng, spot.lat])
      .setDOMContent(buildPopupContent(spot, lang))
      .addTo(map)

    popup.on('close', () => {
      if (suppressCloseRef.current) {
        suppressCloseRef.current = false
        return
      }
      onSelect(null)
    })

    popupRef.current = popup

    const fly = () => map.easeTo({ center: [spot.lng, spot.lat], zoom: 15, duration: 800 })
    if (map.isStyleLoaded()) fly()
    else map.once('load', fly)
  }, [selectedId, lang, spots, onSelect])

  return (
    <div
      ref={mapDivRef}
      className="absolute inset-0"
      style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      aria-label={lang === 'ja' ? '地図' : 'Map'}
    />
  )
}
