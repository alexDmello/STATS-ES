/**
 * Formats a Supabase timestamp string to a neutral local time 
 * to prevent +5:30 timezone shifts in India (IST).
 */
export const formatTournamentTime = (timestamp: string) => {
  if (!timestamp) return { date: '', time: '' };

  // 1. Ensure the timestamp has 'Z' for UTC, add it if missing
  let isoString = timestamp;
  if (!isoString.endsWith('Z') && !isoString.includes('+')) {
    isoString = isoString.replace(/\.\d{3}$/, '') + 'Z';
  }

  // 2. Create a date object from the ISO string
  const dateObj = new Date(isoString);

  // 3. Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return { date: '', time: '' };
  }

  // 4. Format the Date (e.g., 20 JAN 2026) using UTC
  const date = dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).toUpperCase();

  // 5. Format the Time (e.g., 12:00 PM) using UTC
  const time = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });

  return { date, time };
};