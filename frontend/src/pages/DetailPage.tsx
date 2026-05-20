import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight, Info, ArrowRight, Plane, Train, Bus } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import SignInModal from '../components/modals/SignInModal'
import SignUpModal from '../components/modals/SignUpModal'
import WishlistModal from '../components/modals/WishlistModal'
import type { TripOption, TransportType, Leg } from '../types/trip'
import type { WishlistItem } from '../types/wishlist'

type LocationState = {
  trip: TripOption
  from: string
  to: string
  date: string
}

type DetailPageProps = {
  token: string | null
  onLogin: (token: string) => void
  onLogout: () => void
  wishlistItems: WishlistItem[]
  onRemoveFromWishlist: (id: string) => void
}

type ModalName = 'signin' | 'signup' | 'wishlist' | null

const MODE_ICON: Record<TransportType, React.ReactNode> = {
  FLIGHT: <Plane size={16} />,
  TRAIN: <Train size={16} />,
  BUS: <Bus size={16} />,
}

const MODE_LABEL: Record<TransportType, string> = {
  FLIGHT: 'Flight',
  TRAIN: 'Train',
  BUS: 'Bus',
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}

function parseDurationMinutes(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!m) return 0
  return (parseInt(m[1] ?? '0') * 60) + parseInt(m[2] ?? '0')
}

function legDuration(leg: Leg): string {
  const ms = new Date(leg.arrival).getTime() - new Date(leg.departure).getTime()
  return formatDuration(Math.round(ms / 60000))
}

function transferDuration(leg1: Leg, leg2: Leg): string {
  const ms = new Date(leg2.departure).getTime() - new Date(leg1.arrival).getTime()
  return formatDuration(Math.round(ms / 60000))
}

export default function DetailPage({
  token,
  onLogin,
  onLogout,
  wishlistItems,
  onRemoveFromWishlist,
}: DetailPageProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null

  const [openModal, setOpenModal] = useState<ModalName>(null)

  if (!state?.trip) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-[1200px] mx-auto px-8">
          <Navbar
            token={token}
            wishlistCount={wishlistItems.length}
            onOpenSignIn={() => setOpenModal('signin')}
            onOpenSignUp={() => setOpenModal('signup')}
            onOpenWishlist={() => setOpenModal('wishlist')}
            onLogout={onLogout}
          />
          <div className="py-20 text-center text-muted">
            <p>No trip selected.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 inline-flex items-center gap-2 px-[18px] py-[10px] rounded-[10px] text-sm font-medium border border-border hover:bg-surface transition-all"
            >
              Back to search
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { trip, from, to, date } = state
  const segments = trip.legs
  const stops = segments.length - 1

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-8">
        <Navbar
          token={token}
          wishlistCount={wishlistItems.length}
          onOpenSignIn={() => setOpenModal('signin')}
          onOpenSignUp={() => setOpenModal('signup')}
          onOpenWishlist={() => setOpenModal('wishlist')}
          onLogout={onLogout}
        />

        {/* Detail head */}
        <div className="pt-5 pb-7">
          <div className="flex items-center gap-2 text-[13px] text-muted">
            <a href="/" className="text-muted no-underline hover:text-ink">Home</a>
            <ChevronRight size={12} />
            <button
              onClick={() => navigate(-1)}
              className="text-muted hover:text-ink bg-transparent border-0 cursor-pointer text-[13px] p-0"
            >
              Results
            </button>
            <ChevronRight size={12} />
            <span>
              {from} → {to}
            </span>
          </div>

          <h1 className="font-serif font-normal text-[56px] leading-[1.05] tracking-[-0.02em] mt-3.5 mb-0">
            {from} <span className="font-serif italic text-accent">to</span> {to}
          </h1>

          <div className="flex items-center gap-[18px] text-muted text-sm mt-3.5">
            <span className="font-mono text-ink-2">{formatDate(date)}</span>
            <span className="w-[3px] h-[3px] bg-muted-2 rounded-full" />
            <span>
              {MODE_LABEL[trip.type]}{stops > 0 ? ` + ${MODE_LABEL[trip.type].toLowerCase()}` : ''}
            </span>
            {stops > 0 && (
              <>
                <span className="w-[3px] h-[3px] bg-muted-2 rounded-full" />
                <span>
                  {stops} transfer{stops > 1 ? 's' : ''} · {segments[0].to}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div
          className="grid gap-8 pt-3 pb-16"
          style={{ gridTemplateColumns: '1.6fr 1fr' }}
        >
          <div>
            {/* Timeline card */}
            <div className="bg-white border border-border rounded-lg p-8 px-9">
              <h3 className="font-serif font-normal text-2xl m-0 mb-[22px]">Your journey</h3>

              <div className="trip-timeline">
                {segments.map((seg, i) => (
                  <div key={i}>
                    {/* Departure node */}
                    <div className="relative pb-7">
                      <div
                        className={`absolute -left-[26px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                          i === 0
                            ? 'bg-accent border-accent'
                            : 'bg-white border-ink'
                        }`}
                      />
                      <div className="font-mono text-[15px] text-ink-2 font-medium">
                        {i === 0 ? formatTime(seg.departure) : `${formatTime(segments[i - 1].arrival)} → ${formatTime(seg.departure)}`}
                      </div>
                      <div className="text-[17px] font-medium mt-0.5">
                        {seg.from}
                      </div>
                      {i === 0 && (
                        <div className="text-[13px] text-muted mt-0.5">
                          Platform announced 20 min before departure
                        </div>
                      )}
                      {i > 0 && (
                        <div className="text-[13px] text-muted mt-0.5">
                          Transfer · {transferDuration(segments[i - 1], seg)}
                        </div>
                      )}
                    </div>

                    {/* Leg */}
                    <div className="tl-leg-connector">
                      <div className="bg-surface border border-border rounded-xl p-3.5 px-[18px] flex items-center gap-3.5 text-[13px]">
                        <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-accent flex-shrink-0">
                          {MODE_ICON[trip.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-ink">{seg.carrier}</div>
                          <div className="text-muted mt-0.5">
                            {seg.from} → {seg.to}
                          </div>
                        </div>
                        <div className="font-mono text-ink-2 ml-auto flex-shrink-0">
                          {legDuration(seg)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Final arrival node */}
                <div className="relative pt-0">
                  <div className="absolute -left-[26px] top-1 w-3.5 h-3.5 rounded-full bg-accent border-2 border-accent" />
                  <div className="font-mono text-[15px] text-ink-2 font-medium">
                    {formatTime(segments[segments.length - 1].arrival)}
                  </div>
                  <div className="text-[17px] font-medium mt-0.5">
                    {segments[segments.length - 1].to}
                  </div>
                  <div className="text-[13px] text-muted mt-0.5">
                    S-Bahn, U-Bahn connections
                  </div>
                </div>
              </div>
            </div>

            {/* Info card */}
            {stops > 0 && (
              <div className="bg-white border border-border rounded-[14px] p-5 px-6 mt-4 flex items-start gap-3.5">
                <Info size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Good to know</div>
                  <div className="text-[13px] text-muted mt-0.5">
                    Transfer at {segments[0].to} — tickets stay valid if the first leg is
                    delayed.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary card */}
          <aside className="bg-white border border-border rounded-lg p-7 sticky top-20 self-start">
            <div className="text-[13px] text-muted uppercase tracking-[0.08em] font-semibold mb-0.5">
              Trip summary
            </div>

            {[
              { label: 'Departure', value: formatTime(segments[0].departure), mono: true },
              {
                label: 'Arrival',
                value: formatTime(segments[segments.length - 1].arrival),
                mono: true,
              },
              { label: 'Total duration', value: formatDuration(parseDurationMinutes(trip.duration)), mono: true },
              { label: 'Transfers', value: String(stops) },
              { label: 'Passengers', value: '1 adult' },
            ].map(row => (
              <div
                key={row.label}
                className="flex justify-between py-3 text-sm text-ink-2 border-b border-border last:border-0"
              >
                <span>{row.label}</span>
                <span className={`text-ink font-medium ${row.mono ? 'font-mono' : ''}`}>
                  {row.value}
                </span>
              </div>
            ))}

            <div className="flex justify-between pt-4 mt-1 border-t border-border text-sm text-ink-2">
              <span>Total</span>
              <span className="font-serif text-[32px] leading-none">
                <span className="text-[18px] text-muted align-top mr-0.5">€</span>
                {Math.floor(trip.price)}
              </span>
            </div>

            <button className="w-full flex items-center justify-center gap-2 mt-[18px] px-3.5 py-3.5 rounded-[10px] text-[15px] font-medium bg-accent text-white hover:bg-accent-hover transition-all">
              Continue to booking
              <ArrowRight size={16} />
            </button>

            <p className="text-center text-[12px] text-muted mt-3">
              You'll be redirected to the carrier to complete payment
            </p>
          </aside>
        </div>
      </div>

      <SignInModal
        isOpen={openModal === 'signin'}
        onClose={() => setOpenModal(null)}
        onSuccess={onLogin}
        onSwitchToSignUp={() => setOpenModal('signup')}
      />
      <SignUpModal
        isOpen={openModal === 'signup'}
        onClose={() => setOpenModal(null)}
        onSuccess={onLogin}
        onSwitchToSignIn={() => setOpenModal('signin')}
      />
      <WishlistModal
        isOpen={openModal === 'wishlist'}
        onClose={() => setOpenModal(null)}
        items={wishlistItems}
        token={token}
        onRemove={onRemoveFromWishlist}
        onItemClick={item => {
          const params = new URLSearchParams({ from: item.from, to: item.to, date: item.date })
          navigate(`/results?${params}`)
        }}
        onOpenSignIn={() => setOpenModal('signin')}
      />
    </div>
  )
}
