export interface CityData {
  name: string;
  country: string;
  continent: string;
  lat: number;
  lng: number;
  aqi: number;
  population: string;
  trend: 'up' | 'down' | 'stable';
  forecast: number[];
}

export const cities: CityData[] = [
  // Asia - Top polluted
  { name: "New Delhi", country: "India", continent: "Asia", lat: 28.6139, lng: 77.209, aqi: 312, population: "32M", trend: "up", forecast: [290, 305, 312, 328, 340, 355, 348] },
  { name: "Dhaka", country: "Bangladesh", continent: "Asia", lat: 23.8103, lng: 90.4125, aqi: 278, population: "22M", trend: "up", forecast: [260, 270, 278, 285, 290, 295, 288] },
  { name: "Lahore", country: "Pakistan", continent: "Asia", lat: 31.5497, lng: 74.3436, aqi: 245, population: "13M", trend: "up", forecast: [230, 238, 245, 252, 258, 265, 260] },
  { name: "Beijing", country: "China", continent: "Asia", lat: 39.9042, lng: 116.4074, aqi: 185, population: "21M", trend: "down", forecast: [210, 200, 195, 185, 178, 170, 165] },
  { name: "Jakarta", country: "Indonesia", continent: "Asia", lat: -6.2088, lng: 106.8456, aqi: 155, population: "11M", trend: "up", forecast: [140, 145, 150, 155, 162, 168, 165] },
  { name: "Nashik", country: "India", continent: "Asia", lat: 19.9975, lng: 73.7898, aqi: 125, population: "2M", trend: "up", forecast: [110, 115, 118, 125, 130, 135, 132] },
  { name: "Dubai", country: "UAE", continent: "Asia", lat: 25.2048, lng: 55.2708, aqi: 105, population: "3M", trend: "stable", forecast: [100, 102, 105, 108, 105, 103, 106] },
  { name: "Tokyo", country: "Japan", continent: "Asia", lat: 35.6762, lng: 139.6503, aqi: 55, population: "14M", trend: "stable", forecast: [52, 55, 58, 55, 53, 56, 54] },
  
  // Africa - Top polluted
  { name: "Lagos", country: "Nigeria", continent: "Africa", lat: 6.5244, lng: 3.3792, aqi: 168, population: "16M", trend: "up", forecast: [150, 155, 160, 168, 175, 180, 178] },
  { name: "Cairo", country: "Egypt", continent: "Africa", lat: 30.0444, lng: 31.2357, aqi: 142, population: "10M", trend: "stable", forecast: [138, 140, 142, 145, 142, 140, 143] },
  { name: "Kinshasa", country: "DR Congo", continent: "Africa", lat: -4.4419, lng: 15.2663, aqi: 135, population: "15M", trend: "up", forecast: [125, 128, 132, 135, 140, 145, 142] },
  { name: "Johannesburg", country: "South Africa", continent: "Africa", lat: -26.2041, lng: 28.0473, aqi: 98, population: "6M", trend: "stable", forecast: [95, 96, 98, 100, 98, 96, 97] },
  { name: "Nairobi", country: "Kenya", continent: "Africa", lat: -1.2864, lng: 36.8172, aqi: 88, population: "5M", trend: "up", forecast: [82, 85, 88, 92, 95, 98, 96] },
  
  // Europe - Top polluted
  { name: "Moscow", country: "Russia", continent: "Europe", lat: 55.7558, lng: 37.6173, aqi: 88, population: "12M", trend: "up", forecast: [80, 82, 85, 88, 92, 95, 93] },
  { name: "Istanbul", country: "Turkey", continent: "Europe", lat: 41.0082, lng: 28.9784, aqi: 72, population: "16M", trend: "stable", forecast: [68, 70, 72, 75, 72, 70, 71] },
  { name: "Milan", country: "Italy", continent: "Europe", lat: 45.4642, lng: 9.1900, aqi: 65, population: "3M", trend: "down", forecast: [72, 68, 65, 62, 60, 58, 59] },
  { name: "Paris", country: "France", continent: "Europe", lat: 48.8566, lng: 2.3522, aqi: 38, population: "11M", trend: "down", forecast: [45, 42, 40, 38, 36, 34, 35] },
  { name: "London", country: "UK", continent: "Europe", lat: 51.5074, lng: -0.1278, aqi: 42, population: "9M", trend: "down", forecast: [48, 45, 42, 40, 38, 35, 37] },
  
  // North America - Top polluted
  { name: "Los Angeles", country: "USA", continent: "North America", lat: 34.0522, lng: -118.2437, aqi: 78, population: "13M", trend: "stable", forecast: [75, 78, 82, 78, 74, 76, 80] },
  { name: "Mexico City", country: "Mexico", continent: "North America", lat: 19.4326, lng: -99.1332, aqi: 115, population: "22M", trend: "up", forecast: [105, 110, 115, 120, 125, 128, 122] },
  { name: "Phoenix", country: "USA", continent: "North America", lat: 33.4484, lng: -112.0740, aqi: 68, population: "5M", trend: "stable", forecast: [65, 68, 70, 68, 66, 67, 69] },
  { name: "Toronto", country: "Canada", continent: "North America", lat: 43.6532, lng: -79.3832, aqi: 45, population: "6M", trend: "down", forecast: [50, 48, 45, 42, 40, 38, 40] },
  
  // South America - Top polluted
  { name: "São Paulo", country: "Brazil", continent: "South America", lat: -23.5505, lng: -46.6333, aqi: 95, population: "22M", trend: "up", forecast: [85, 88, 92, 95, 102, 108, 105] },
  { name: "Lima", country: "Peru", continent: "South America", lat: -12.0464, lng: -77.0428, aqi: 88, population: "11M", trend: "stable", forecast: [85, 86, 88, 90, 88, 86, 87] },
  { name: "Bogotá", country: "Colombia", continent: "South America", lat: 4.7110, lng: -74.0721, aqi: 75, population: "11M", trend: "up", forecast: [68, 72, 75, 78, 82, 85, 83] },
  { name: "Buenos Aires", country: "Argentina", continent: "South America", lat: -34.6037, lng: -58.3816, aqi: 52, population: "15M", trend: "stable", forecast: [50, 52, 54, 52, 50, 51, 53] },
  
  // Oceania
  { name: "Sydney", country: "Australia", continent: "Oceania", lat: -33.8688, lng: 151.2093, aqi: 28, population: "5M", trend: "down", forecast: [32, 30, 28, 26, 25, 24, 26] },
  { name: "Melbourne", country: "Australia", continent: "Oceania", lat: -37.8136, lng: 144.9631, aqi: 32, population: "5M", trend: "stable", forecast: [30, 32, 34, 32, 30, 31, 33] },
];

export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return "hsl(142, 76%, 50%)";
  if (aqi <= 100) return "hsl(45, 100%, 55%)";
  if (aqi <= 150) return "hsl(25, 100%, 55%)";
  if (aqi <= 200) return "hsl(0, 84%, 55%)";
  if (aqi <= 300) return "hsl(280, 80%, 55%)";
  return "hsl(320, 90%, 40%)";
}

export function getAqiLabel(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy (Sensitive)";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

export function getAqiTailwindColor(aqi: number): string {
  if (aqi <= 50) return "text-aqi-good";
  if (aqi <= 100) return "text-aqi-moderate";
  if (aqi <= 150) return "text-aqi-unhealthy-sensitive";
  if (aqi <= 200) return "text-aqi-unhealthy";
  if (aqi <= 300) return "text-aqi-very-unhealthy";
  return "text-aqi-hazardous";
}

export function getTopPollutedByContinent(limit: number = 8): Record<string, CityData[]> {
  const continents = ["Asia", "Africa", "Europe", "North America", "South America", "Oceania"];
  const result: Record<string, CityData[]> = {};
  
  continents.forEach(continent => {
    result[continent] = cities
      .filter(city => city.continent === continent)
      .sort((a, b) => b.aqi - a.aqi)
      .slice(0, limit);
  });
  
  return result;
}

export function getAllTopPollutedCities(limit: number = 10): CityData[] {
  return [...cities].sort((a, b) => b.aqi - a.aqi).slice(0, limit);
}
