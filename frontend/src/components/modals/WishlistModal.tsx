import { ArrowRight, Trash2, Heart } from 'lucide-react'
import Modal from '../ui/Modal'
import type { WishlistItem } from '../../types/wishlist'

type WishlistModalProps = {
  isOpen: boolean
  onClose: () => void
  items: WishlistItem[]
  token: string | null
  onRemove: (id: string) => void
  onItemClick: (item: WishlistItem) => void
  onOpenSignIn: () => void
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export default function WishlistModal({
  isOpen,
  onClose,
  items,
  token,
  onRemove,
  onItemClick,
  onOpenSignIn,
}: WishlistModalProps) {
  const count = items.length

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[580px]">
      <h2 className="font-serif text-[36px] leading-[1.05] tracking-[-0.02em] m-0 mb-2">
        Saved <span className="italic text-accent">searches.</span>
      </h2>
      <p className="text-muted text-sm m-0 mb-4">
        {token
          ? `${count} saved ${count === 1 ? 'search' : 'searches'} · we'll alert you on price drops.`
          : 'Sign in to see your saved searches.'}
      </p>

      {!token ? (
        <button
          onClick={() => {
            onClose()
            onOpenSignIn()
          }}
          className="inline-flex items-center gap-2 px-[18px] py-[10px] rounded-[10px] text-sm font-medium border-transparent bg-accent text-white hover:bg-accent-hover transition-all"
        >
          Sign in
        </button>
      ) : count === 0 ? (
        <div className="flex flex-col items-center py-12 text-muted text-sm text-center">
          <Heart size={36} className="text-muted-2 mb-3" />
          <p className="m-0">
            No saved searches yet.
            <br />
            Run a search and tap "Save search" on the results page.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[480px] overflow-y-auto">
          {items.map(item => (
            <div
              key={item.id}
              className="border border-border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all hover:border-border-strong hover:bg-surface"
              onClick={() => {
                onItemClick(item)
                onClose()
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 font-medium text-[15px]">
                  {item.from}
                  <ArrowRight size={14} className="text-muted-2 flex-shrink-0" />
                  {item.to}
                </div>
                <div className="text-[12px] text-muted font-mono mt-1">{formatDate(item.date)}</div>
              </div>

              <button
                className="p-2 rounded-lg text-muted-2 hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-all"
                onClick={e => {
                  e.stopPropagation()
                  onRemove(item.id)
                }}
                aria-label="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
