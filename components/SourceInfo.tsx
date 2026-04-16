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

export function SourceInfo({
  source,
  sourceUrl,
  effectiveDate,
  fetchedAt,
  status,
  note,
}: SourceInfoProps) {
  const statusLabel =
    status === "ok" ? "Live Data" : status === "fallback" ? "Fallback Data" : "Error";
  const statusClasses =
    status === "ok"
      ? "bg-emerald-100 text-emerald-700"
      : status === "fallback"
        ? "bg-amber-100 text-amber-700"
        : "bg-rose-100 text-rose-700";

  return (
    <section className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-amber-900">Data Details</p>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses}`}>
          {statusLabel}
        </span>
      </div>

      <div className="grid gap-2 text-sm text-amber-950 md:grid-cols-2">
        <p>
          <span className="font-semibold">Source:</span>{" "}
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="underline">
            {source}
          </a>
        </p>
        <p>
          <span className="font-semibold">Effective Date:</span> {formatDate(effectiveDate)}
        </p>
        <p>
          <span className="font-semibold">Fetched At:</span> {formatDate(fetchedAt)}
        </p>
      </div>
      {note ? <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900/90">Note: {note}</p> : null}
    </section>
  );
}
