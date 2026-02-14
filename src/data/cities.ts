export interface CityData {
  name: string;
  country: string;
  lat: number;
  lng: number;
  aqi: number;
  population: string;
  trend: 'up' | 'down' | 'stable';
  forecast: number[];
}

export const cities: CityData[] = [
  { name: "New Delhi", country: "India", lat: 28.6139, lng: 77.209, aqi: 312, population: "32M", trend: "up", forecast: [290, 305, 312, 328, 340, 355, 348] },
  { name: "Beijing", country: "China", lat: 39.9042, lng: 116.4074, aqi: 185, population: "21M", trend: "down", forecast: [210, 200, 195, 185, 178, 170, 165] },
  { name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437, aqi: 78, population: "13M", trend: "stable", forecast: [75, 78, 82, 78, 74, 76, 80] },
  { name: "London", country: "UK", lat: 51.5074, lng: -0.1278, aqi: 42, population: "9M", trend: "down", forecast: [48, 45, 42, 40, 38, 35, 37] },
  { name: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333, aqi: 95, population: "22M", trend: "up", forecast: [85, 88, 92, 95, 102, 108, 105] },
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, aqi: 55, population: "14M", trend: "stable", forecast: [52, 55, 58, 55, 53, 56, 54] },
  { name: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792, aqi: 168, population: "16M", trend: "up", forecast: [150, 155, 160, 168, 175, 180, 178] },
  { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, aqi: 142, population: "10M", trend: "stable", forecast: [138, 140, 142, 145, 142, 140, 143] },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, aqi: 28, population: "5M", trend: "down", forecast: [32, 30, 28, 26, 25, 24, 26] },
  { name: "Moscow", country: "Russia", lat: 55.7558, lng: 37.6173, aqi: 88, population: "12M", trend: "up", forecast: [80, 82, 85, 88, 92, 95, 93] },
  { name: "Nashik", country: "India", lat: 19.9975, lng: 73.7898, aqi: 125, population: "2M", trend: "up", forecast: [110, 115, 118, 125, 130, 135, 132] },
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, aqi: 105, population: "3M", trend: "stable", forecast: [100, 102, 105, 108, 105, 103, 106] },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, aqi: 38, population: "11M", trend: "down", forecast: [45, 42, 40, 38, 36, 34, 35] },
  { name: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456, aqi: 155, population: "11M", trend: "up", forecast: [140, 145, 150, 155, 162, 168, 165] },
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
