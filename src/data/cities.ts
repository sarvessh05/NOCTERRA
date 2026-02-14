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
  isPermanent?: boolean; // For cities that should never rotate out
}

// Permanent cities that always appear
export const permanentCities: CityData[] = [
  { name: "Nashik", country: "India", continent: "Asia", lat: 19.9975, lng: 73.7898, aqi: 125, population: "2M", trend: "up", forecast: [110, 115, 118, 125, 130, 135, 132], isPermanent: true },
];

// Pool of famous cities per continent (for daily rotation)
export const cityPool: Record<string, CityData[]> = {
  Asia: [
    { name: "Tokyo", country: "Japan", continent: "Asia", lat: 35.6762, lng: 139.6503, aqi: 55, population: "14M", trend: "stable", forecast: [52, 55, 58, 55, 53, 56, 54] },
    { name: "New Delhi", country: "India", continent: "Asia", lat: 28.6139, lng: 77.209, aqi: 312, population: "32M", trend: "up", forecast: [290, 305, 312, 328, 340, 355, 348] },
    { name: "Beijing", country: "China", continent: "Asia", lat: 39.9042, lng: 116.4074, aqi: 185, population: "21M", trend: "down", forecast: [210, 200, 195, 185, 178, 170, 165] },
    { name: "Shanghai", country: "China", continent: "Asia", lat: 31.2304, lng: 121.4737, aqi: 145, population: "27M", trend: "stable", forecast: [140, 145, 148, 145, 142, 140, 143] },
    { name: "Mumbai", country: "India", continent: "Asia", lat: 19.0760, lng: 72.8777, aqi: 158, population: "21M", trend: "up", forecast: [145, 150, 155, 158, 165, 170, 168] },
    { name: "Seoul", country: "South Korea", continent: "Asia", lat: 37.5665, lng: 126.9780, aqi: 78, population: "10M", trend: "stable", forecast: [75, 78, 80, 78, 76, 77, 79] },
    { name: "Bangkok", country: "Thailand", continent: "Asia", lat: 13.7563, lng: 100.5018, aqi: 95, population: "11M", trend: "up", forecast: [88, 92, 95, 98, 102, 105, 103] },
    { name: "Jakarta", country: "Indonesia", continent: "Asia", lat: -6.2088, lng: 106.8456, aqi: 155, population: "11M", trend: "up", forecast: [140, 145, 150, 155, 162, 168, 165] },
    { name: "Singapore", country: "Singapore", continent: "Asia", lat: 1.3521, lng: 103.8198, aqi: 42, population: "6M", trend: "down", forecast: [48, 45, 42, 40, 38, 36, 38] },
    { name: "Dubai", country: "UAE", continent: "Asia", lat: 25.2048, lng: 55.2708, aqi: 105, population: "3M", trend: "stable", forecast: [100, 102, 105, 108, 105, 103, 106] },
    { name: "Hong Kong", country: "China", continent: "Asia", lat: 22.3193, lng: 114.1694, aqi: 68, population: "7M", trend: "down", forecast: [75, 72, 68, 65, 62, 60, 63] },
    { name: "Dhaka", country: "Bangladesh", continent: "Asia", lat: 23.8103, lng: 90.4125, aqi: 278, population: "22M", trend: "up", forecast: [260, 270, 278, 285, 290, 295, 288] },
    { name: "Karachi", country: "Pakistan", continent: "Asia", lat: 24.8607, lng: 67.0011, aqi: 188, population: "16M", trend: "up", forecast: [175, 180, 185, 188, 195, 200, 198] },
    { name: "Manila", country: "Philippines", continent: "Asia", lat: 14.5995, lng: 120.9842, aqi: 112, population: "14M", trend: "stable", forecast: [108, 110, 112, 115, 112, 110, 111] },
    { name: "Kuala Lumpur", country: "Malaysia", continent: "Asia", lat: 3.1390, lng: 101.6869, aqi: 85, population: "8M", trend: "stable", forecast: [82, 85, 88, 85, 83, 84, 86] },
  ],
  
  Europe: [
    { name: "London", country: "UK", continent: "Europe", lat: 51.5074, lng: -0.1278, aqi: 42, population: "9M", trend: "down", forecast: [48, 45, 42, 40, 38, 35, 37] },
    { name: "Paris", country: "France", continent: "Europe", lat: 48.8566, lng: 2.3522, aqi: 38, population: "11M", trend: "down", forecast: [45, 42, 40, 38, 36, 34, 35] },
    { name: "Berlin", country: "Germany", continent: "Europe", lat: 52.5200, lng: 13.4050, aqi: 35, population: "4M", trend: "stable", forecast: [33, 35, 37, 35, 34, 35, 36] },
    { name: "Madrid", country: "Spain", continent: "Europe", lat: 40.4168, lng: -3.7038, aqi: 48, population: "7M", trend: "stable", forecast: [45, 48, 50, 48, 46, 47, 49] },
    { name: "Rome", country: "Italy", continent: "Europe", lat: 41.9028, lng: 12.4964, aqi: 55, population: "4M", trend: "up", forecast: [50, 52, 55, 58, 60, 62, 60] },
    { name: "Moscow", country: "Russia", continent: "Europe", lat: 55.7558, lng: 37.6173, aqi: 88, population: "12M", trend: "up", forecast: [80, 82, 85, 88, 92, 95, 93] },
    { name: "Istanbul", country: "Turkey", continent: "Europe", lat: 41.0082, lng: 28.9784, aqi: 72, population: "16M", trend: "stable", forecast: [68, 70, 72, 75, 72, 70, 71] },
    { name: "Amsterdam", country: "Netherlands", continent: "Europe", lat: 52.3676, lng: 4.9041, aqi: 32, population: "2M", trend: "down", forecast: [38, 35, 32, 30, 28, 27, 29] },
    { name: "Vienna", country: "Austria", continent: "Europe", lat: 48.2082, lng: 16.3738, aqi: 40, population: "2M", trend: "stable", forecast: [38, 40, 42, 40, 39, 40, 41] },
    { name: "Athens", country: "Greece", continent: "Europe", lat: 37.9838, lng: 23.7275, aqi: 62, population: "3M", trend: "up", forecast: [58, 60, 62, 65, 68, 70, 68] },
    { name: "Warsaw", country: "Poland", continent: "Europe", lat: 52.2297, lng: 21.0122, aqi: 58, population: "2M", trend: "stable", forecast: [55, 58, 60, 58, 56, 57, 59] },
    { name: "Stockholm", country: "Sweden", continent: "Europe", lat: 59.3293, lng: 18.0686, aqi: 25, population: "1M", trend: "down", forecast: [30, 28, 25, 23, 22, 21, 23] },
    { name: "Prague", country: "Czech Republic", continent: "Europe", lat: 50.0755, lng: 14.4378, aqi: 45, population: "1M", trend: "stable", forecast: [43, 45, 47, 45, 44, 45, 46] },
  ],
  
  "North America": [
    { name: "New York", country: "USA", continent: "North America", lat: 40.7128, lng: -74.0060, aqi: 52, population: "19M", trend: "stable", forecast: [50, 52, 54, 52, 51, 52, 53] },
    { name: "Los Angeles", country: "USA", continent: "North America", lat: 34.0522, lng: -118.2437, aqi: 78, population: "13M", trend: "stable", forecast: [75, 78, 82, 78, 74, 76, 80] },
    { name: "Mexico City", country: "Mexico", continent: "North America", lat: 19.4326, lng: -99.1332, aqi: 115, population: "22M", trend: "up", forecast: [105, 110, 115, 120, 125, 128, 122] },
    { name: "Toronto", country: "Canada", continent: "North America", lat: 43.6532, lng: -79.3832, aqi: 45, population: "6M", trend: "down", forecast: [50, 48, 45, 42, 40, 38, 40] },
    { name: "Chicago", country: "USA", continent: "North America", lat: 41.8781, lng: -87.6298, aqi: 48, population: "9M", trend: "stable", forecast: [46, 48, 50, 48, 47, 48, 49] },
    { name: "Vancouver", country: "Canada", continent: "North America", lat: 49.2827, lng: -123.1207, aqi: 28, population: "3M", trend: "down", forecast: [32, 30, 28, 26, 25, 24, 26] },
    { name: "San Francisco", country: "USA", continent: "North America", lat: 37.7749, lng: -122.4194, aqi: 42, population: "5M", trend: "stable", forecast: [40, 42, 44, 42, 41, 42, 43] },
    { name: "Miami", country: "USA", continent: "North America", lat: 25.7617, lng: -80.1918, aqi: 38, population: "6M", trend: "down", forecast: [42, 40, 38, 36, 35, 34, 36] },
    { name: "Houston", country: "USA", continent: "North America", lat: 29.7604, lng: -95.3698, aqi: 65, population: "7M", trend: "up", forecast: [60, 62, 65, 68, 70, 72, 70] },
    { name: "Montreal", country: "Canada", continent: "North America", lat: 45.5017, lng: -73.5673, aqi: 35, population: "4M", trend: "stable", forecast: [33, 35, 37, 35, 34, 35, 36] },
    { name: "Phoenix", country: "USA", continent: "North America", lat: 33.4484, lng: -112.0740, aqi: 68, population: "5M", trend: "stable", forecast: [65, 68, 70, 68, 66, 67, 69] },
    { name: "Seattle", country: "USA", continent: "North America", lat: 47.6062, lng: -122.3321, aqi: 32, population: "4M", trend: "down", forecast: [38, 35, 32, 30, 28, 27, 29] },
  ],
  
  "South America": [
    { name: "São Paulo", country: "Brazil", continent: "South America", lat: -23.5505, lng: -46.6333, aqi: 95, population: "22M", trend: "up", forecast: [85, 88, 92, 95, 102, 108, 105] },
    { name: "Buenos Aires", country: "Argentina", continent: "South America", lat: -34.6037, lng: -58.3816, aqi: 52, population: "15M", trend: "stable", forecast: [50, 52, 54, 52, 50, 51, 53] },
    { name: "Rio de Janeiro", country: "Brazil", continent: "South America", lat: -22.9068, lng: -43.1729, aqi: 68, population: "13M", trend: "stable", forecast: [65, 68, 70, 68, 66, 67, 69] },
    { name: "Lima", country: "Peru", continent: "South America", lat: -12.0464, lng: -77.0428, aqi: 88, population: "11M", trend: "stable", forecast: [85, 86, 88, 90, 88, 86, 87] },
    { name: "Bogotá", country: "Colombia", continent: "South America", lat: 4.7110, lng: -74.0721, aqi: 75, population: "11M", trend: "up", forecast: [68, 72, 75, 78, 82, 85, 83] },
    { name: "Santiago", country: "Chile", continent: "South America", lat: -33.4489, lng: -70.6693, aqi: 82, population: "7M", trend: "up", forecast: [75, 78, 82, 85, 88, 90, 88] },
    { name: "Caracas", country: "Venezuela", continent: "South America", lat: 10.4806, lng: -66.9036, aqi: 72, population: "3M", trend: "stable", forecast: [68, 70, 72, 75, 72, 70, 71] },
    { name: "Quito", country: "Ecuador", continent: "South America", lat: -0.1807, lng: -78.4678, aqi: 58, population: "3M", trend: "stable", forecast: [55, 58, 60, 58, 56, 57, 59] },
    { name: "Montevideo", country: "Uruguay", continent: "South America", lat: -34.9011, lng: -56.1645, aqi: 42, population: "2M", trend: "down", forecast: [48, 45, 42, 40, 38, 36, 38] },
    { name: "La Paz", country: "Bolivia", continent: "South America", lat: -16.5000, lng: -68.1500, aqi: 65, population: "2M", trend: "stable", forecast: [62, 65, 68, 65, 63, 64, 66] },
    { name: "Medellín", country: "Colombia", continent: "South America", lat: 6.2442, lng: -75.5812, aqi: 62, population: "3M", trend: "up", forecast: [58, 60, 62, 65, 68, 70, 68] },
  ],
  
  Africa: [
    { name: "Cairo", country: "Egypt", continent: "Africa", lat: 30.0444, lng: 31.2357, aqi: 142, population: "10M", trend: "stable", forecast: [138, 140, 142, 145, 142, 140, 143] },
    { name: "Lagos", country: "Nigeria", continent: "Africa", lat: 6.5244, lng: 3.3792, aqi: 168, population: "16M", trend: "up", forecast: [150, 155, 160, 168, 175, 180, 178] },
    { name: "Johannesburg", country: "South Africa", continent: "Africa", lat: -26.2041, lng: 28.0473, aqi: 98, population: "6M", trend: "stable", forecast: [95, 96, 98, 100, 98, 96, 97] },
    { name: "Nairobi", country: "Kenya", continent: "Africa", lat: -1.2864, lng: 36.8172, aqi: 88, population: "5M", trend: "up", forecast: [82, 85, 88, 92, 95, 98, 96] },
    { name: "Kinshasa", country: "DR Congo", continent: "Africa", lat: -4.4419, lng: 15.2663, aqi: 135, population: "15M", trend: "up", forecast: [125, 128, 132, 135, 140, 145, 142] },
    { name: "Casablanca", country: "Morocco", continent: "Africa", lat: 33.5731, lng: -7.5898, aqi: 78, population: "4M", trend: "stable", forecast: [75, 78, 80, 78, 76, 77, 79] },
    { name: "Addis Ababa", country: "Ethiopia", continent: "Africa", lat: 9.0320, lng: 38.7469, aqi: 92, population: "5M", trend: "up", forecast: [85, 88, 92, 95, 98, 100, 98] },
    { name: "Accra", country: "Ghana", continent: "Africa", lat: 5.6037, lng: -0.1870, aqi: 105, population: "3M", trend: "stable", forecast: [100, 102, 105, 108, 105, 103, 106] },
    { name: "Dar es Salaam", country: "Tanzania", continent: "Africa", lat: -6.7924, lng: 39.2083, aqi: 85, population: "7M", trend: "up", forecast: [78, 82, 85, 88, 90, 92, 90] },
    { name: "Cape Town", country: "South Africa", continent: "Africa", lat: -33.9249, lng: 18.4241, aqi: 52, population: "4M", trend: "down", forecast: [58, 55, 52, 50, 48, 46, 48] },
    { name: "Algiers", country: "Algeria", continent: "Africa", lat: 36.7538, lng: 3.0588, aqi: 72, population: "3M", trend: "stable", forecast: [68, 70, 72, 75, 72, 70, 71] },
  ],
  
  Oceania: [
    { name: "Sydney", country: "Australia", continent: "Oceania", lat: -33.8688, lng: 151.2093, aqi: 28, population: "5M", trend: "down", forecast: [32, 30, 28, 26, 25, 24, 26] },
    { name: "Melbourne", country: "Australia", continent: "Oceania", lat: -37.8136, lng: 144.9631, aqi: 32, population: "5M", trend: "stable", forecast: [30, 32, 34, 32, 30, 31, 33] },
    { name: "Brisbane", country: "Australia", continent: "Oceania", lat: -27.4698, lng: 153.0251, aqi: 25, population: "2M", trend: "down", forecast: [28, 26, 25, 23, 22, 21, 23] },
    { name: "Perth", country: "Australia", continent: "Oceania", lat: -31.9505, lng: 115.8605, aqi: 30, population: "2M", trend: "stable", forecast: [28, 30, 32, 30, 29, 30, 31] },
    { name: "Auckland", country: "New Zealand", continent: "Oceania", lat: -36.8485, lng: 174.7633, aqi: 22, population: "2M", trend: "down", forecast: [26, 24, 22, 20, 19, 18, 20] },
    { name: "Wellington", country: "New Zealand", continent: "Oceania", lat: -41.2865, lng: 174.7762, aqi: 18, population: "0.5M", trend: "stable", forecast: [17, 18, 19, 18, 17, 18, 19] },
    { name: "Adelaide", country: "Australia", continent: "Oceania", lat: -34.9285, lng: 138.6007, aqi: 28, population: "1M", trend: "stable", forecast: [26, 28, 30, 28, 27, 28, 29] },
    { name: "Canberra", country: "Australia", continent: "Oceania", lat: -35.2809, lng: 149.1300, aqi: 24, population: "0.5M", trend: "down", forecast: [28, 26, 24, 22, 21, 20, 22] },
    { name: "Christchurch", country: "New Zealand", continent: "Oceania", lat: -43.5321, lng: 172.6362, aqi: 20, population: "0.4M", trend: "stable", forecast: [19, 20, 21, 20, 19, 20, 21] },
    { name: "Hobart", country: "Australia", continent: "Oceania", lat: -42.8821, lng: 147.3272, aqi: 19, population: "0.2M", trend: "down", forecast: [22, 20, 19, 18, 17, 16, 18] },
  ],
};

// Get current active cities (permanent + daily rotation)
export function getActiveCities(): CityData[] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const activeCities: CityData[] = [...permanentCities];
  
  Object.entries(cityPool).forEach(([continent, cities]) => {
    // Shuffle cities based on day of year (deterministic daily rotation)
    const shuffled = [...cities].sort((a, b) => {
      const hashA = (a.name.charCodeAt(0) + dayOfYear) % cities.length;
      const hashB = (b.name.charCodeAt(0) + dayOfYear) % cities.length;
      return hashA - hashB;
    });
    
    // Take first 10 cities for this continent
    activeCities.push(...shuffled.slice(0, 10));
  });
  
  return activeCities;
}

export const cities = getActiveCities();

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
