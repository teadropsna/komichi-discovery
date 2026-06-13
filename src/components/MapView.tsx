import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Lang, Spot } from '../types'

interface Props {
  spots: Spot[]
  lang: Lang
  selectedId: string | null
  onSelect: (id: string) => void
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

export default function MapView({ spots, lang, selectedId, onSelect }: Props) {
  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerElsRef = useRef<Record<string, HTMLDivElement>>({})

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
    })
    mapRef.current = map

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

      el.addEventListener('click', () => onSelect(spot.id))

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

  // 選択中のスポットをマーカーの見た目とカメラに反映
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

    if (!selectedId) return
    const map = mapRef.current
    const spot = spots.find((s) => s.id === selectedId)
    if (!map || !spot) return

    const fly = () => map.easeTo({ center: [spot.lng, spot.lat], zoom: 15, duration: 800 })
    if (map.isStyleLoaded()) fly()
    else map.once('load', fly)
  }, [selectedId, spots])

  return (
    <div
      ref={mapDivRef}
      className="absolute inset-0"
      style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      aria-label={lang === 'ja' ? '地図' : 'Map'}
    />
  )
}
