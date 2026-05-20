import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowRight, Heart, ChevronRight } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Filters from '../components/results/Filters'
import TripCard from '../components/results/TripCard'
import SearchCard from '../components/search/SearchCard'
import SignInModal from '../components/modals/SignInModal'
import SignUpModal from '../components/modals/SignUpModal'
import WishlistModal from '../components/modals/WishlistModal'
import { searchTrips } from '../api/search'
import { addToWishlist, removeFromWishlist } from '../api/wishlist'
import type { TripOption, TransportType } from '../types/trip'
import type { WishlistItem } from '../types/wishlist'

type ResultsPageProps = {
  token: string | null
  onLogin: (token: string) => void
  onLogout: () => void
  wishlistItems: WishlistItem[]
  onAddToWishlist: (item: WishlistItem) => void
  onRemoveFromWishlist: (id: string) => void
}

type ModalName = 'signin' | 'signup' | 'wishlist' | null
type Tab = 'fastest' | 'cheapest'

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}

export default function ResultsPage({
  token,
  onLogin,
  onLogout,
  wishlistItems,
  onAddToWishlist,
  onRemoveFromWishlist,
}: ResultsPageProps) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const from = searchParams.get('from') ?? ''
  const to = searchParams.get('to') ?? ''
  const date = searchParams.get('date') ?? ''
  const passengers = Number(searchParams.get('passengers') ?? 1)

  const [results, setResults] = useState<TripOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<Tab>('fastest')
  const [selectedTypes, setSelectedTypes] = useState<Set<TransportType>>(
    new Set(['FLIGHT', 'TRAIN', 'BUS']),
  )
  const [maxStops, setMaxStops] = useState<'direct' | '1' | 'any'>('any')

  const [openModal, setOpenModal] = useState<ModalName>(null)
  const [searchSaved, setSearchSaved] = useState(false)
  const [savingSearch, setSavingSearch] = useState(false)

  // Check if current search is already saved
  const isCurrentSearchSaved = useMemo(
    () => wishlistItems.some(i => i.from === from && i.to === to && i.date === date),
    [wishlistItems, from, to, date],
  )

  useEffect(() => {
    setSearchSaved(isCurrentSearchSaved)
  }, [isCurrentSearchSaved])

  useEffect(() => {
    if (!from || !to || !date) return
    setLoading(true)
    setError(null)
    searchTrips(from, to, date, passengers)
      .then(setResults)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [from, to, date, passengers])

  function parseDurationMinutes(iso: string): number {
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
    if (!m) return 0
    return (parseInt(m[1] ?? '0') * 60) + parseInt(m[2] ?? '0')
  }

  const filtered = useMemo(() => {
    let items = results.filter(r => selectedTypes.has(r.type))
    if (maxStops === 'direct') items = items.filter(r => r.legs.length === 1)
    if (maxStops === '1') items = items.filter(r => r.legs.length <= 2)
    return items
  }, [results, selectedTypes, maxStops])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    if (activeTab === 'fastest') copy.sort((a, b) => parseDurationMinutes(a.duration) - parseDurationMinutes(b.duration))
    else copy.sort((a, b) => a.price - b.price)
    return copy
  }, [filtered, activeTab])

  const fastestDuration = results.length
    ? Math.min(...results.map(r => parseDurationMinutes(r.duration)))
    : null
  const fastestPrice = results.length ? Math.min(...results.map(r => r.price)) : null
  const cheapestPrice = results.length ? Math.min(...results.map(r => r.price)) : null
  const cheapestDuration = results.length
    ? Math.min(...results.map(r => parseDurationMinutes(r.duration)))
    : null

  async function handleSaveSearch() {
    if (!token) {
      setOpenModal('signin')
      return
    }
    if (searchSaved) return
    setSavingSearch(true)
    try {
      const item = await addToWishlist({ from, to, date }, token)
      onAddToWishlist(item)
      setSearchSaved(true)
    } catch {
      // silently ignore
    } finally {
      setSavingSearch(false)
    }
  }

  function handleViewDetails(trip: TripOption) {
    navigate('/detail', { state: { trip, from, to, date } })
  }

  function handleWishlistRemove(id: string) {
    onRemoveFromWishlist(id)
    removeFromWishlist(id, token!).catch(() => {})
    if (wishlistItems.find(i => i.id === id && i.from === from && i.to === to && i.date === date)) {
      setSearchSaved(false)
    }
  }

  function handleWishlistItemClick(item: WishlistItem) {
    const params = new URLSearchParams({ from: item.from, to: item.to, date: item.date })
    navigate(`/results?${params}`)
  }

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

        {/* Results header */}
        <div className="pt-4 pb-6 border-b border-border">
          <div className="flex items-center gap-2 text-[13px] text-muted mb-3.5">
            <a href="/" className="text-muted no-underline hover:text-ink">Home</a>
            <ChevronRight size={12} />
            <span>Search results</span>
          </div>

          <div className="flex items-center gap-3 px-5 py-3.5 bg-white border border-border rounded-xl shadow-sm flex-wrap">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-2 rounded-lg text-sm font-medium">
              {from}
            </span>
            <ArrowRight size={16} className="text-muted" />
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-2 rounded-lg text-sm font-medium">
              {to}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-2 rounded-lg text-sm font-medium">
              {formatDate(date)}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-2 rounded-lg text-sm font-medium">
              {passengers} {passengers === 1 ? 'adult' : 'adults'}
            </span>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleSaveSearch}
                disabled={savingSearch || searchSaved}
                className={`inline-flex items-center gap-1.5 px-[18px] py-[10px] rounded-[10px] text-sm font-medium border transition-all ${
                  searchSaved
                    ? 'bg-accent-soft text-accent border-[rgba(124,58,237,0.25)]'
                    : 'bg-transparent text-ink border-border hover:bg-surface'
                }`}
              >
                <Heart size={14} className={searchSaved ? 'fill-current' : ''} />
                {searchSaved ? 'Saved' : 'Save search'}
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="grid gap-8 py-8 pb-16" style={{ gridTemplateColumns: '240px 1fr' }}>
          <Filters
            results={results}
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
            maxStops={maxStops}
            onMaxStopsChange={setMaxStops}
          />

          <div>
            {/* Fastest / Cheapest tabs */}
            <div className="flex gap-1 p-1 bg-surface-2 rounded-xl mb-5 max-w-[540px]">
              {(['fastest', 'cheapest'] as Tab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3.5 py-2.5 rounded-[9px] text-left border-0 cursor-pointer font-sans transition-all ${
                    activeTab === tab ? 'bg-white shadow-sm' : 'bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {activeTab === tab && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    )}
                    <span className="text-[13px] font-semibold text-ink capitalize">{tab}</span>
                  </div>
                  <div className="text-[11px] text-muted font-mono mt-0.5">
                    {tab === 'fastest' && fastestDuration !== null
                      ? `from ${formatDuration(fastestDuration)} · €${fastestPrice !== null ? Math.floor(fastestPrice) : '—'}`
                      : tab === 'cheapest' && cheapestPrice !== null
                        ? `from €${Math.floor(cheapestPrice)} · ${cheapestDuration !== null ? formatDuration(cheapestDuration) : '—'}`
                        : '—'}
                  </div>
                </button>
              ))}
            </div>

            {/* Meta row */}
            <div className="flex items-center justify-between text-[13px] text-muted mb-3.5">
              <div>
                Showing <span className="font-mono">{sorted.length}</span> options
                {loading && ' · loading…'}
              </div>
              <div>
                Sort:{' '}
                <strong className="text-ink">
                  {activeTab === 'fastest' ? 'Duration' : 'Price'}
                </strong>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] rounded-xl text-sm mb-4">
                {error}
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-[120px] bg-surface-2 rounded-[14px] animate-pulse" />
                ))}
              </div>
            )}

            {/* Results */}
            {!loading &&
              sorted.map((trip, i) => (
                <TripCard
                  key={`${trip.provider}-${trip.duration}-${i}`}
                  trip={trip}
                  featured={i === 0}
                  onViewDetails={handleViewDetails}
                />
              ))}

            {!loading && sorted.length === 0 && !error && (
              <div className="text-center py-16 text-muted">
                No results found for the selected filters.
              </div>
            )}
          </div>
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
        onRemove={handleWishlistRemove}
        onItemClick={handleWishlistItemClick}
        onOpenSignIn={() => setOpenModal('signin')}
      />
    </div>
  )
}
