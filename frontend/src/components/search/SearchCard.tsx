import { useState, useEffect } from 'react'
import { Calendar, Users, Search } from 'lucide-react'
import CityInput from './CityInput'
import { isValidCity, type City } from '../../data/cities'
import { getCities } from '../../api/cities'

type SearchValues = {
  from: string
  to: string
  date: string
  passengers: number
}

type SearchCardProps = {
  initialValues?: Partial<SearchValues>
  onSearch: (values: SearchValues) => void
}

export default function SearchCard({ initialValues, onSearch }: SearchCardProps) {
  const today = new Date().toISOString().slice(0, 10)
  const [cities, setCities] = useState<City[]>([])
  const [from, setFrom] = useState(initialValues?.from ?? '')
  const [to, setTo] = useState(initialValues?.to ?? '')
  const [fromValid, setFromValid] = useState(false)
  const [toValid, setToValid] = useState(false)
  const [fromError, setFromError] = useState(false)
  const [toError, setToError] = useState(false)
  const [date, setDate] = useState(initialValues?.date ?? today)
  const [passengers, setPassengers] = useState(initialValues?.passengers ?? 1)

  useEffect(() => {
    getCities().then(data => {
      setCities(data)
      if (initialValues?.from) setFromValid(isValidCity(data, initialValues.from))
      if (initialValues?.to) setToValid(isValidCity(data, initialValues.to))
    })
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fErr = !fromValid || !from.trim()
    const tErr = !toValid || !to.trim()
    if (fErr || tErr || !date) {
      setFromError(fErr)
      setToError(tErr)
      return
    }
    onSearch({ from: from.trim(), to: to.trim(), date, passengers })
  }

  const fieldClass =
    'flex-1 flex flex-col px-[18px] py-3.5 border-r border-border last:border-r-0 text-left cursor-text'
  const labelClass = 'text-[11px] text-muted uppercase tracking-[0.08em] font-semibold mb-1.5'
  const valueClass = 'flex items-center gap-2 text-base font-medium text-ink'
  const inputClass =
    'bg-transparent border-none outline-none text-base font-medium text-ink w-full placeholder:text-muted-2'

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[920px] bg-white border border-border rounded-lg shadow-lg p-2 flex items-stretch"
    >
      <div className={`${fieldClass} ${fromError ? 'bg-[#FEF2F2] rounded-lg' : ''}`}>
        <div className={`${labelClass} ${fromError ? 'text-[#DC2626]' : ''}`}>From</div>
        <div className={valueClass}>
          <CityInput
            cities={cities}
            value={from}
            onChange={(val, valid) => { setFrom(val); setFromValid(valid); setFromError(false) }}
            placeholder="City or airport"
            inputClassName={inputClass}
            hasError={fromError}
          />
        </div>
        {fromError && <div className="text-[11px] text-[#DC2626] mt-1">Choose a city from the list</div>}
      </div>

      <div className={`${fieldClass} ${toError ? 'bg-[#FEF2F2] rounded-lg' : ''}`}>
        <div className={`${labelClass} ${toError ? 'text-[#DC2626]' : ''}`}>To</div>
        <div className={valueClass}>
          <CityInput
            cities={cities}
            value={to}
            onChange={(val, valid) => { setTo(val); setToValid(valid); setToError(false) }}
            placeholder="City or airport"
            inputClassName={inputClass}
            hasError={toError}
          />
        </div>
        {toError && <div className="text-[11px] text-[#DC2626] mt-1">Choose a city from the list</div>}
      </div>

      <div className={fieldClass} style={{ flex: '0 0 auto', minWidth: 160 }}>
        <div className={labelClass}>Date</div>
        <div className={valueClass}>
          <Calendar size={16} className="text-muted flex-shrink-0" />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            min={today}
            className={`${inputClass} [color-scheme:light]`}
            required
          />
        </div>
      </div>

      <div className={fieldClass} style={{ flex: '0 0 auto', minWidth: 140 }}>
        <div className={labelClass}>Travellers</div>
        <div className={valueClass}>
          <Users size={16} className="text-muted flex-shrink-0" />
          <select
            value={passengers}
            onChange={e => setPassengers(Number(e.target.value))}
            className={`${inputClass} cursor-pointer`}
          >
            {[1, 2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'adult' : 'adults'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-2 flex items-stretch">
        <button
          type="submit"
          className="flex items-center gap-2 px-[26px] py-4 rounded-xl text-[15px] font-medium border-transparent bg-accent text-white hover:bg-accent-hover transition-all whitespace-nowrap"
        >
          <Search size={16} />
          Search
        </button>
      </div>
    </form>
  )
}
