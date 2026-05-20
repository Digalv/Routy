import type { City } from '../data/cities'

let cache: City[] | null = null
let inflight: Promise<City[]> | null = null

export function getCities(): Promise<City[]> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = fetch('/api/cities')
      .then(r => r.json())
      .then((data: City[]) => {
        cache = data
        return data
      })
  }
  return inflight
}
