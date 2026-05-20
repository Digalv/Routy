import { useState, useRef, useEffect } from 'react'
import { filterCities, isValidCity, type City } from '../../data/cities'

type CityInputProps = {
  cities: City[]
  value: string
  onChange: (value: string, valid: boolean) => void
  placeholder?: string
  inputClassName?: string
  hasError?: boolean
}

const COUNTRY_FLAG: Record<string, string> = {
  DE: '🇩🇪', FR: '🇫🇷', NL: '🇳🇱', BE: '🇧🇪', CH: '🇨🇭', AT: '🇦🇹',
  GB: '🇬🇧', IE: '🇮🇪', ES: '🇪🇸', PT: '🇵🇹', IT: '🇮🇹', DK: '🇩🇰',
  SE: '🇸🇪', NO: '🇳🇴', FI: '🇫🇮', PL: '🇵🇱', CZ: '🇨🇿', HU: '🇭🇺',
  RO: '🇷🇴', BG: '🇧🇬', GR: '🇬🇷', EE: '🇪🇪', LV: '🇱🇻', LT: '🇱🇹',
}

export default function CityInput({ cities, value, onChange, placeholder, inputClassName, hasError }: CityInputProps) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const matches = filterCities(cities, value)

  function select(city: City) {
    onChange(city.name, true)
    setOpen(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    onChange(val, isValidCity(cities, val))
    setHighlighted(0)
    setOpen(val.trim().length >= 1)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, matches.length - 1))
      setOpen(true)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && open && matches.length > 0) {
      e.preventDefault()
      select(matches[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => value.trim().length >= 1 && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className={`${inputClassName ?? ''} ${hasError ? 'placeholder:text-[#DC2626]' : ''}`}
      />

      {open && matches.length > 0 && (
        <ul className="absolute left-0 top-[calc(100%+8px)] z-50 bg-white border border-border rounded-xl shadow-lg overflow-hidden w-[220px] py-1">
          {matches.map((city, i) => (
            <li
              key={city.id}
              onMouseDown={() => select(city)}
              onMouseEnter={() => setHighlighted(i)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer select-none transition-colors ${
                i === highlighted ? 'bg-surface' : 'hover:bg-surface'
              }`}
            >
              <span className="text-base leading-none">{COUNTRY_FLAG[city.country] ?? '🌍'}</span>
              <span className="text-[13px] font-medium text-ink">{city.name}</span>
              <span className="text-[11px] text-muted ml-auto font-mono">{city.iata}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
