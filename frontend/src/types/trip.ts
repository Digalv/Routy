export type TransportType = 'FLIGHT' | 'TRAIN' | 'BUS'

export type SearchRequest = {
  from: string
  to: string
  date: string
  passengers: number
}

export type Leg = {
  from: string
  to: string
  departure: string  // ISO instant
  arrival: string    // ISO instant
  carrier: string
}

export type TripOption = {
  type: TransportType
  legs: Leg[]
  price: number       // actual amount in currency units (e.g. 80.00 EUR)
  currency: string
  duration: string    // ISO-8601 duration e.g. "PT2H30M"
  provider: string
}
