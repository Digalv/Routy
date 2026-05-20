import { Heart, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

type NavbarProps = {
  token: string | null
  wishlistCount: number
  onOpenSignIn: () => void
  onOpenSignUp: () => void
  onOpenWishlist: () => void
  onLogout: () => void
}

export default function Navbar({
  token,
  wishlistCount,
  onOpenSignIn,
  onOpenSignUp,
  onOpenWishlist,
  onLogout,
}: NavbarProps) {
  return (
    <nav className="flex items-center justify-between py-[22px]">
      <Link
        to="/"
        className="flex items-center gap-2 font-serif text-2xl tracking-tight text-ink no-underline"
      >
        <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
        Routy
      </Link>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenWishlist}
          className="relative w-9 h-9 rounded-[10px] border border-border text-ink-2 hover:bg-surface hover:text-accent hover:border-border-strong transition-all flex items-center justify-center"
          aria-label="Wishlist"
        >
          <Heart size={18} />
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-accent text-white text-[11px] font-semibold rounded-[9px] flex items-center justify-center font-mono leading-none">
              {wishlistCount}
            </span>
          )}
        </button>

        {token ? (
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-[18px] py-[10px] rounded-[10px] text-sm font-medium border border-border bg-transparent text-ink hover:bg-surface transition-all"
          >
            <LogOut size={14} />
            Log out
          </button>
        ) : (
          <>
            <button
              onClick={onOpenSignIn}
              className="inline-flex items-center gap-2 px-[18px] py-[10px] rounded-[10px] text-sm font-medium border border-border bg-transparent text-ink hover:bg-surface transition-all"
            >
              Sign in
            </button>
            <button
              onClick={onOpenSignUp}
              className="inline-flex items-center gap-2 px-[18px] py-[10px] rounded-[10px] text-sm font-medium border border-transparent bg-accent text-white hover:bg-accent-hover transition-all"
            >
              Get started
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
