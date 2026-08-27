type SourceInfoProps = {
  source: string;
  sourceUrl: string;
  effectiveDate: string;
  fetchedAt: string;
  status: "ok" | "fallback" | "error";
  note?: string;
};

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  // Fixed locale/timeZone so server-rendered and hydrated client text always match,
  // regardless of the host machine's default locale.
  return parsed.toLocaleString("en-GB", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function SourceInfo({ source, sourceUrl, effectiveDate, fetchedAt, note }: SourceInfoProps) {
  return (
    <section className="source-info">
      <span>
        Source:{" "}
        <a href={sourceUrl} target="_blank" rel="noreferrer">
          {source}
        </a>
      </span>
      <span>
        Effective: <strong>{formatDate(effectiveDate)}</strong>
      </span>
      <span>
        Fetched: <strong>{formatDate(fetchedAt)}</strong>
      </span>
      {note ? <span>Note: {note}</span> : null}
    </section>
  );
}
