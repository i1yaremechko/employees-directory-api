const BIRTH_DATE_PATTERN = /^(\d{2})\.(\d{2})\.(\d{4})$/;

export function parseBirthDate(value: string): string | null {
  const match = BIRTH_DATE_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);

  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealDate =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;

  return isRealDate ? `${yyyy}-${mm}-${dd}` : null;
}

export function formatBirthDate(isoDate: string): string {
  const [yyyy, mm, dd] = isoDate.split('-');
  return `${dd}.${mm}.${yyyy}`;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
