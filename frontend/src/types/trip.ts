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
  departure: string
  arrival: string
  carrier: string
}

export type TripOption = {
  type: TransportType
  legs: Leg[]
  price: number
  currency: string
  duration: string
  provider: string
}
