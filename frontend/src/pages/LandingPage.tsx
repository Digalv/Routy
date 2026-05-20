import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plane, Train, Bus, Zap, DollarSign } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import SearchCard from '../components/search/SearchCard'
import SignInModal from '../components/modals/SignInModal'
import SignUpModal from '../components/modals/SignUpModal'
import WishlistModal from '../components/modals/WishlistModal'
import type { WishlistItem } from '../types/wishlist'

type LandingPageProps = {
  token: string | null
  onLogin: (token: string) => void
  onLogout: () => void
  wishlistItems: WishlistItem[]
  onRemoveFromWishlist: (id: string) => void
}

type ModalName = 'signin' | 'signup' | 'wishlist' | null

export default function LandingPage({
  token,
  onLogin,
  onLogout,
  wishlistItems,
  onRemoveFromWishlist,
}: LandingPageProps) {
  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState<ModalName>(null)

  function handleSearch(values: { from: string; to: string; date: string; passengers: number }) {
    const params = new URLSearchParams({
      from: values.from,
      to: values.to,
      date: values.date,
      passengers: String(values.passengers),
    })
    navigate(`/results?${params}`)
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
      </div>

      {/* Hero */}
      <div className="bg-dot-grid">
        <div className="max-w-[1200px] mx-auto px-8 pb-8">
          <div className="pt-16 pb-8 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-soft text-accent rounded-full text-[13px] font-medium border border-[rgba(124,58,237,0.15)]">
              <Zap size={14} />
              Flights · Trains · Buses across Europe
            </span>

            <h1 className="font-serif font-normal text-[84px] leading-[1.02] tracking-[-0.02em] mt-6 mb-4">
              One search,{' '}
              <span className="italic text-accent">every way</span>
              <br />
              to get there.
            </h1>

            <p className="text-muted text-lg max-w-[580px] mx-auto">
              Routy looks across planes, trains and buses at the same time, then ranks two honest
              options — the fastest and the cheapest.
            </p>
          </div>

          <SearchCard onSearch={handleSearch} />

          <div className="flex justify-center gap-8 mt-7 text-muted text-sm">
            <div className="flex items-center gap-2">
              <Plane size={18} className="text-ink-2" />
              Flights
            </div>
            <div className="flex items-center gap-2">
              <Train size={18} className="text-ink-2" />
              Trains
            </div>
            <div className="flex items-center gap-2">
              <Bus size={18} className="text-ink-2" />
              Buses
            </div>
          </div>
        </div>
      </div>

      {/* Two options section */}
      <div className="max-w-[1200px] mx-auto px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="font-serif font-normal text-[48px] leading-[1.05] tracking-[-0.02em] m-0 mb-3">
            Two options,{' '}
            <span className="font-serif italic text-accent">no nonsense.</span>
          </h2>
          <p className="text-muted max-w-[560px] mx-auto">
            We don't show you forty results sorted by ad spend. We show you two — and tell you
            exactly what you're trading.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 max-w-[760px] mx-auto">
          <div className="bg-white border border-border rounded-lg p-7 hover:border-border-strong hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="w-11 h-11 rounded-[10px] bg-accent-soft text-accent flex items-center justify-center mb-[18px]">
              <Zap size={22} />
            </div>
            <h3 className="font-serif font-normal text-[28px] m-0 mb-2">Fastest</h3>
            <p className="text-muted m-0 mb-5">
              The least time door-to-door, even if it costs more or means flying.
            </p>
            <div className="font-mono text-[13px] text-ink-2 pt-4 border-t border-dashed border-border">
              avg savings · <span className="text-accent">3h 20m</span> vs slowest
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-7 hover:border-border-strong hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="w-11 h-11 rounded-[10px] bg-accent-soft text-accent flex items-center justify-center mb-[18px]">
              <DollarSign size={22} />
            </div>
            <h3 className="font-serif font-normal text-[28px] m-0 mb-2">Cheapest</h3>
            <p className="text-muted m-0 mb-5">
              The lowest total fare across operators, including overnight buses if that's the play.
            </p>
            <div className="font-mono text-[13px] text-ink-2 pt-4 border-t border-dashed border-border">
              avg savings · <span className="text-accent">42%</span> vs fastest
            </div>
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
        onRemove={onRemoveFromWishlist}
        onItemClick={handleWishlistItemClick}
        onOpenSignIn={() => setOpenModal('signin')}
      />
    </div>
  )
}
