export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fffaf0] via-[#fffdf8] to-white px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 md:px-6 md:py-12">
      <div className="mx-auto w-full max-w-6xl animate-pulse space-y-6">
        <div className="h-52 rounded-3xl bg-amber-100/80 dark:bg-slate-800/70" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-40 rounded-2xl bg-amber-100/70 dark:bg-slate-800/70" />
          <div className="h-40 rounded-2xl bg-amber-100/70 dark:bg-slate-800/70" />
          <div className="h-40 rounded-2xl bg-amber-100/70 dark:bg-slate-800/70" />
        </div>
        <div className="h-28 rounded-2xl bg-amber-100/70 dark:bg-slate-800/70" />
      </div>
    </main>
  );
}
