/**
 * Generate a unique ticket hash
 * Returns a long numeric string similar to real ticket hashes
 */
export function generateTicketHash(): string {
  // Generate a long random numeric string (24 digits)
  // Using timestamp + random to ensure uniqueness
  const timestamp = Date.now().toString(); // 13 digits
  const random = Math.random().toString().slice(2); // Get decimal part
  const combined = (timestamp + random).replace(/[^0-9]/g, ''); // Keep only digits
  return combined.slice(0, 24); // Return 24-digit hash
}
