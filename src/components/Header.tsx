import type { Lang } from '../types'

interface Props {
  lang: Lang
  onLangChange: (lang: Lang) => void
}

const COPY = {
  ja: { title: 'コミチ発見', subtitle: 'Komichi Discovery' },
  en: { title: 'Komichi Discovery', subtitle: 'いつもの道、まちかど発見' },
}

const textShadow = '0 1px 2px rgba(255,255,255,0.9), 0 1px 6px rgba(255,255,255,0.7)'

export default function Header({ lang, onLangChange }: Props) {
  const t = COPY[lang]

  return (
    <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3 pointer-events-none">
      <div className="select-none">
        <h1
          className="text-2xl font-extrabold text-orange-500 tracking-tight leading-tight"
          style={{ textShadow }}
        >
          🧭 {t.title}
        </h1>
        <p className="text-xs font-semibold text-stone-600" style={{ textShadow }}>
          {t.subtitle}
        </p>
      </div>

      <div className="pointer-events-auto">
        <div className="bg-white/90 backdrop-blur rounded-full shadow-md p-1 flex text-sm font-semibold">
          <button
            onClick={() => onLangChange('ja')}
            className={`px-3 py-1 rounded-full transition ${
              lang === 'ja' ? 'bg-orange-400 text-white' : 'text-stone-500'
            }`}
          >
            JA
          </button>
          <button
            onClick={() => onLangChange('en')}
            className={`px-3 py-1 rounded-full transition ${
              lang === 'en' ? 'bg-orange-400 text-white' : 'text-stone-500'
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </div>
  )
}
