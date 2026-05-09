// ── Time conversion helpers ──

export function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function isOnHour(time: string) {
  return toMinutes(time) % 60 === 0;
}

export function generateHalfHourSlots(startMinutes: number, endMinutes: number) {
  const result: string[] = [];
  for (let current = startMinutes; current <= endMinutes; current += 30) {
    result.push(formatMinutes(current));
  }
  return result;
}
