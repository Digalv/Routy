export type WishlistItem = {
  id: string
  from: string
  to: string
  date: string
  createdAt: string
}

export type SaveWishlistRequest = {
  from: string
  to: string
  date: string
}
