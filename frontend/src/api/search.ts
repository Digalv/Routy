import { apiGet } from './client'
import type { TripOption } from '../types/trip'

export function searchTrips(from: string, to: string, date: string, passengers = 1): Promise<TripOption[]> {
  const params = new URLSearchParams({ from, to, date, passengers: String(passengers) })
  return apiGet<TripOption[]>(`/search?${params}`)
}
