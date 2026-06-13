import type { Lang } from '../types'

interface Props {
  lang: Lang
  onLangChange: (lang: Lang) => void
  onTodaysPick: () => void
}

const COPY = {
  ja: { title: 'コミチ発見', subtitle: 'Komichi Discovery', pick: '🎲 今日のひとつ' },
  en: { title: 'Komichi Discovery', subtitle: 'いつもの道、まちかど発見', pick: "🎲 Today's Pick" },
}

export default function Header({ lang, onLangChange, onTodaysPick }: Props) {
  const t = COPY[lang]

  return (
    <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3 pointer-events-none">
      <div className="bg-white/90 backdrop-blur rounded-2xl shadow-md px-4 py-3 pointer-events-auto">
        <h1 className="text-lg font-bold text-stone-800 leading-tight">{t.title}</h1>
        <p className="text-xs text-orange-500">{t.subtitle}</p>
      </div>

      <div className="flex flex-col items-end gap-2 pointer-events-auto">
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

        <button
          onClick={onTodaysPick}
          className="bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-full shadow-md px-4 py-2 text-sm transition"
        >
          {t.pick}
        </button>
      </div>
    </div>
  )
}
