export type City = {
  id: string
  name: string
  country: string
  iata: string
}

export function isValidCity(cities: City[], name: string): boolean {
  return cities.some(c => c.name.toLowerCase() === name.trim().toLowerCase())
}

export function filterCities(cities: City[], query: string): City[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const starts = cities.filter(c => c.name.toLowerCase().startsWith(q))
  const contains = cities.filter(c => !c.name.toLowerCase().startsWith(q) && c.name.toLowerCase().includes(q))
  return [...starts, ...contains].slice(0, 7)
}
