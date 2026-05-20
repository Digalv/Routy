import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ResultsPage from './pages/ResultsPage'
import DetailPage from './pages/DetailPage'
import { getWishlist } from './api/wishlist'
import type { WishlistItem } from './types/wishlist'

const TOKEN_KEY = 'routy_token'

function loadToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export default function App() {
  const [token, setToken] = useState<string | null>(loadToken)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    if (!token) {
      setWishlistItems([])
      return
    }
    getWishlist(token)
      .then(setWishlistItems)
      .catch(() => setWishlistItems([]))
  }, [token])

  function handleLogin(newToken: string) {
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }

  function handleAddToWishlist(item: WishlistItem) {
    setWishlistItems(prev => [...prev, item])
  }

  function handleRemoveFromWishlist(id: string) {
    setWishlistItems(prev => prev.filter(i => i.id !== id))
  }

  const commonProps = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
    wishlistItems,
    onRemoveFromWishlist: handleRemoveFromWishlist,
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage {...commonProps} />} />
        <Route
          path="/results"
          element={
            <ResultsPage
              {...commonProps}
              onAddToWishlist={handleAddToWishlist}
            />
          }
        />
        <Route path="/detail" element={<DetailPage {...commonProps} />} />
      </Routes>
    </BrowserRouter>
  )
}
