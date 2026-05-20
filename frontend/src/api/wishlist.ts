import { apiGet, apiPost, apiDelete } from './client'
import type { WishlistItem, SaveWishlistRequest } from '../types/wishlist'

export function getWishlist(token: string): Promise<WishlistItem[]> {
  return apiGet<WishlistItem[]>('/wishlist', { token })
}

export function addToWishlist(data: SaveWishlistRequest, token: string): Promise<WishlistItem> {
  return apiPost<SaveWishlistRequest, WishlistItem>('/wishlist', data, { token })
}

export function removeFromWishlist(id: string, token: string): Promise<void> {
  return apiDelete(`/wishlist/${id}`, { token })
}
