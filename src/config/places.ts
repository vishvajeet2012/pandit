/** Birth places offered in the kundli tool. Offsets are in minutes from UTC. */
export type Place = { id: string; name: string; deva: string; lat: number; lon: number; tz: number };

export const PLACES: Place[] = [
  { id: "jaipur", name: "Jaipur", deva: "जयपुर", lat: 26.9124, lon: 75.7873, tz: 330 },
  { id: "delhi", name: "Delhi", deva: "दिल्ली", lat: 28.6139, lon: 77.209, tz: 330 },
  { id: "mumbai", name: "Mumbai", deva: "मुम्बई", lat: 19.076, lon: 72.8777, tz: 330 },
  { id: "kolkata", name: "Kolkata", deva: "कोलकाता", lat: 22.5726, lon: 88.3639, tz: 330 },
  { id: "chennai", name: "Chennai", deva: "चेन्नई", lat: 13.0827, lon: 80.2707, tz: 330 },
  { id: "bengaluru", name: "Bengaluru", deva: "बेंगलुरु", lat: 12.9716, lon: 77.5946, tz: 330 },
  { id: "hyderabad", name: "Hyderabad", deva: "हैदराबाद", lat: 17.385, lon: 78.4867, tz: 330 },
  { id: "ahmedabad", name: "Ahmedabad", deva: "अहमदाबाद", lat: 23.0225, lon: 72.5714, tz: 330 },
  { id: "pune", name: "Pune", deva: "पुणे", lat: 18.5204, lon: 73.8567, tz: 330 },
  { id: "jodhpur", name: "Jodhpur", deva: "जोधपुर", lat: 26.2389, lon: 73.0243, tz: 330 },
  { id: "udaipur", name: "Udaipur", deva: "उदयपुर", lat: 24.5854, lon: 73.7125, tz: 330 },
  { id: "varanasi", name: "Varanasi", deva: "वाराणसी", lat: 25.3176, lon: 82.9739, tz: 330 },
  { id: "lucknow", name: "Lucknow", deva: "लखनऊ", lat: 26.8467, lon: 80.9462, tz: 330 },
  { id: "patna", name: "Patna", deva: "पटना", lat: 25.5941, lon: 85.1376, tz: 330 },
  { id: "bhopal", name: "Bhopal", deva: "भोपाल", lat: 23.2599, lon: 77.4126, tz: 330 },
  { id: "chandigarh", name: "Chandigarh", deva: "चंडीगढ़", lat: 30.7333, lon: 76.7794, tz: 330 },
  { id: "amritsar", name: "Amritsar", deva: "अमृतसर", lat: 31.634, lon: 74.8723, tz: 330 },
  { id: "guwahati", name: "Guwahati", deva: "गुवाहाटी", lat: 26.1445, lon: 91.7362, tz: 330 },
  { id: "kochi", name: "Kochi", deva: "कोच्चि", lat: 9.9312, lon: 76.2673, tz: 330 },
  { id: "surat", name: "Surat", deva: "सूरत", lat: 21.1702, lon: 72.8311, tz: 330 },
  { id: "nagpur", name: "Nagpur", deva: "नागपुर", lat: 21.1458, lon: 79.0882, tz: 330 },
  { id: "dubai", name: "Dubai", deva: "दुबई", lat: 25.2048, lon: 55.2708, tz: 240 },
  { id: "singapore", name: "Singapore", deva: "सिंगापुर", lat: 1.3521, lon: 103.8198, tz: 480 },
  { id: "london", name: "London", deva: "लंदन", lat: 51.5074, lon: -0.1278, tz: 0 },
  { id: "newyork", name: "New York", deva: "न्यूयॉर्क", lat: 40.7128, lon: -74.006, tz: -300 },
];

/** Offsets offered when a place is entered by hand. */
export const TZ_OFFSETS = [
  -480, -420, -360, -300, -240, -180, 0, 60, 120, 180, 210, 240, 270, 300, 330,
  345, 360, 390, 420, 480, 540, 570, 600, 720,
];

export function formatOffset(minutes: number): string {
  const sign = minutes < 0 ? "−" : "+";
  const abs = Math.abs(minutes);
  return `UTC${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}
