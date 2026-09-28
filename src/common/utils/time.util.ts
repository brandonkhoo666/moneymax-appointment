export function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalInMinutes: number,
  includeEndTime = false,
): string[] {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  let current = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  const slots: string[] = [];

  while (includeEndTime ? current <= end : current < end) {
    const hour = Math.floor(current / 60);
    const minute = current % 60;

    slots.push(
      `${String(hour).padStart(2, '0')}:` +
        `${String(minute).padStart(2, '0')}:00`,
    );

    current += intervalInMinutes;
  }

  return slots;
}

export function generateDailyLockSlots(): string[] {
  const slots: string[] = [];

  for (let minutes = 0; minutes < 24 * 60; minutes += 5) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;

    slots.push(
      `${String(hour).padStart(2, '0')}:` +
        `${String(minute).padStart(2, '0')}:00`,
    );
  }

  return slots;
}
