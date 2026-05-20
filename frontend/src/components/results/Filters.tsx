import type { TransportType, TripOption } from '../../types/trip'

type FiltersProps = {
  results: TripOption[]
  selectedTypes: Set<TransportType>
  onTypesChange: (types: Set<TransportType>) => void
  maxStops: 'direct' | '1' | 'any'
  onMaxStopsChange: (v: 'direct' | '1' | 'any') => void
}

const TYPE_LABELS: Record<TransportType, string> = {
  FLIGHT: '✈ Flights',
  TRAIN: '🚆 Trains',
  BUS: '🚌 Buses',
}

function countByType(results: TripOption[], type: TransportType) {
  return results.filter(r => r.type === type).length
}

export default function Filters({
  results,
  selectedTypes,
  onTypesChange,
  maxStops,
  onMaxStopsChange,
}: FiltersProps) {
  function toggleType(type: TransportType) {
    const next = new Set(selectedTypes)
    if (next.has(type)) next.delete(type)
    else next.add(type)
    onTypesChange(next)
  }

  const h4Class = 'text-[12px] uppercase tracking-[0.08em] text-muted font-semibold mt-6 mb-3 first:mt-0'
  const checkClass = 'flex items-center gap-2.5 text-sm text-ink-2 py-1.5 cursor-pointer select-none'
  const countClass = 'ml-auto text-muted-2 font-mono text-[12px]'

  return (
    <aside>
      <h4 className={h4Class}>Transport</h4>
      {(['FLIGHT', 'TRAIN', 'BUS'] as TransportType[]).map(type => (
        <label key={type} className={checkClass}>
          <input
            type="checkbox"
            checked={selectedTypes.has(type)}
            onChange={() => toggleType(type)}
            className="w-4 h-4 accent-accent"
          />
          {TYPE_LABELS[type]}
          <span className={countClass}>{countByType(results, type)}</span>
        </label>
      ))}

      <h4 className={h4Class}>Max stops</h4>
      {([
        { value: 'direct', label: 'Direct only' },
        { value: '1', label: 'Up to 1 stop' },
        { value: 'any', label: 'Any' },
      ] as const).map(({ value, label }) => (
        <label key={value} className={checkClass}>
          <input
            type="radio"
            name="stops"
            checked={maxStops === value}
            onChange={() => onMaxStopsChange(value)}
            className="w-4 h-4 accent-accent"
          />
          {label}
        </label>
      ))}
    </aside>
  )
}
