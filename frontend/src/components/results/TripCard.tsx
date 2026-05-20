import { Plane, Train, Bus } from 'lucide-react'
import type { TripOption, TransportType } from '../../types/trip'

function parseDurationMinutes(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!m) return 0
  return (parseInt(m[1] ?? '0') * 60) + parseInt(m[2] ?? '0')
}

type TripCardProps = {
  trip: TripOption
  featured?: boolean
  onViewDetails: (trip: TripOption) => void
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}


const TYPE_ICON: Record<TransportType, React.ReactNode> = {
  FLIGHT: <Plane size={14} />,
  TRAIN: <Train size={14} />,
  BUS: <Bus size={14} />,
}

const TYPE_EMOJI: Record<TransportType, string> = {
  FLIGHT: '✈',
  TRAIN: '🚆',
  BUS: '🚌',
}

const TYPE_LABEL: Record<TransportType, string> = {
  FLIGHT: 'Flight',
  TRAIN: 'Train',
  BUS: 'Bus',
}

export default function TripCard({ trip, featured = false, onViewDetails }: TripCardProps) {
  const first = trip.legs[0]
  const last = trip.legs[trip.legs.length - 1]
  const stops = trip.legs.length - 1
  const stopLabel = stops === 0 ? 'Direct' : `${stops} transfer${stops > 1 ? 's' : ''}`

  return (
    <article
      className="bg-white border border-border rounded-[14px] p-[22px_24px] grid gap-6 mb-3 transition-all hover:border-[rgba(124,58,237,0.4)] hover:shadow-accent hover:-translate-y-0.5"
      style={{ gridTemplateColumns: '1fr auto' }}
    >
      <div>
        <div className="flex gap-1.5 mb-3.5">
          {featured && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[14px] font-semibold border border-transparent bg-accent-soft text-accent border-[rgba(124,58,237,0.2)]">
              ★ Best match
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium border border-border text-ink-2">
            {TYPE_EMOJI[trip.type]} {TYPE_LABEL[trip.type]} · {trip.provider}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium border border-border text-ink-2">
            {stopLabel}
          </span>
        </div>

        <div className="flex items-center gap-7">
          <div>
            <div className="font-mono text-[22px] font-medium tracking-[-0.01em]">
              {formatTime(first.departure)}
            </div>
            <div className="text-[13px] text-muted mt-0.5">{first.from}</div>
          </div>

          <div className="flex-1 max-w-[360px]">
            <div className="duration-line flex items-center justify-center">
              <span className="bg-white px-1 text-ink-2 z-10 relative">
                {TYPE_ICON[trip.type]}
              </span>
            </div>
            <div className="text-center text-[12px] text-muted font-mono mt-0.5">
              {formatDuration(parseDurationMinutes(trip.duration))} · {stopLabel.toLowerCase()}
            </div>
          </div>

          <div>
            <div className="font-mono text-[22px] font-medium tracking-[-0.01em]">
              {formatTime(last.arrival)}
            </div>
            <div className="text-[13px] text-muted mt-0.5">{last.to}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-2.5 min-w-[140px]">
        <div>
          <div className="font-serif text-[34px] leading-none">
            <span className="text-[18px] text-muted align-top mr-0.5">€</span>
            {Math.floor(trip.price)}
          </div>
          <div className="text-[12px] text-muted text-right">per person</div>
        </div>
        <button
          onClick={() => onViewDetails(trip)}
          className="inline-flex items-center gap-2 px-[18px] py-[10px] rounded-[10px] text-sm font-medium transition-all bg-accent text-white border-transparent hover:bg-accent-hover"
        >
          View details
        </button>
      </div>
    </article>
  )
}
