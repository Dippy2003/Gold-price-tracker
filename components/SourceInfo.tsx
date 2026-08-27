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
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
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
