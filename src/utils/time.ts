export function checkHHMMFormatting(time: string) {
  const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  return time.match(timeRegex);
}

//Accepts a date object as input. Returns a number b/w 0 and 1439
export function dateToUTCMinutes(date: Date): number {
  // Get hours and minutes from the date
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  // Calculate total minutes of the day
  return hours * 60 + minutes;
}

//Accepts a date object as input. Returns a time foratted in hh:mm format
export function dateToTimeString(date: Date): string {
  // Get hours and minutes
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  // Format hours and minutes as two-digit strings
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

export function formattedTimeStringToMinutes(time: string): number {
  // Validate input format
  const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  const match = time.match(timeRegex);
  if (!match) {
    throw new Error("Invalid time format. Use 'hh:mm' format (24-hour clock).");
  }

  // Parse hours and minutes
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  // Convert to total minutes
  return hours * 60 + minutes;
}

export function minutesToFormattedTimeString(minutes: number): string {
  if (minutes < 0 || minutes > 1439) {
    throw new Error("Input must be a number between 0 and 1439.");
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = mins.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}
