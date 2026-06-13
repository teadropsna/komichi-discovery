import type { Lang, Spot } from '../types'

interface Props {
  spot: Spot
  lang: Lang
  onClose: () => void
}

const COPY = {
  ja: { trivia: '知ってましたか？', bestTime: 'おすすめの時間帯', close: '閉じる' },
  en: { trivia: 'Did you know?', bestTime: 'Best time to visit', close: 'Close' },
}

export default function SpotCard({ spot, lang, onClose }: Props) {
  const t = COPY[lang]

  return (
    <div className="absolute bottom-0 left-0 right-0 md:bottom-5 md:left-5 md:right-auto md:w-[380px] bg-white rounded-t-2xl md:rounded-2xl shadow-xl p-5 max-h-[60vh] overflow-y-auto">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{spot.emoji}</span>
          <div>
            <h2 className="text-lg font-bold text-stone-800">{spot.name[lang]}</h2>
            <p className="text-sm text-orange-500">{spot.category[lang]}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label={t.close}
          className="text-stone-400 hover:text-stone-600 text-xl leading-none px-1"
        >
          &times;
        </button>
      </div>

      <div className="mt-4 bg-orange-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-orange-500 mb-1">{t.trivia}</p>
        <p className="text-sm text-stone-700 leading-relaxed">{spot.trivia[lang]}</p>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-stone-500">
        <span>🕒</span>
        <span>
          {t.bestTime}: {spot.bestTime[lang]}
        </span>
      </div>
    </div>
  )
}
