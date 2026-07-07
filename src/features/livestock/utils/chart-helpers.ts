export interface DataPoint {
  date: Date;
  value: number;
  isFake?: boolean;
}

export function parseLocalDate(dateStr: string): Date {
  if (dateStr.includes("T")) {
    return new Date(dateStr);
  }
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
}

export function formatTemporalData(
  records: { made_at: string; value: number }[],
  filter: "month" | "year" | "all",
  now: Date = new Date()
): DataPoint[] {
  const sorted = records
    .map(r => ({ date: parseLocalDate(r.made_at), value: r.value }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (sorted.length === 0) return [];

  let startDate: Date;
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  if (filter === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  } else if (filter === "year") {
    startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
  } else {
    return sorted;
  }

  const inRange = sorted.filter(r => r.date >= startDate && r.date <= endDate);

  const priorRecords = sorted.filter(r => r.date < startDate);
  const lastKnownValue = priorRecords.length > 0 ? priorRecords[priorRecords.length - 1].value : null;

  if (inRange.length === 0) {
    if (lastKnownValue === null) return [];
    return [
      { date: startDate, value: lastKnownValue, isFake: true },
      { date: endDate, value: lastKnownValue, isFake: true }
    ];
  }

  const result: DataPoint[] = [];

  if (lastKnownValue !== null) {
    result.push({ date: startDate, value: lastKnownValue, isFake: true });
  }

  result.push(...inRange);

  const lastReal = inRange[inRange.length - 1];
  if (lastReal.date.getTime() < endDate.getTime()) {
    result.push({ date: endDate, value: lastReal.value, isFake: true });
  }

  return result;
}
