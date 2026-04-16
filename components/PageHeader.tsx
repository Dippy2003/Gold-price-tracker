type PageHeaderProps = {
  title: string;
  subtitle: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-amber-200/70 bg-white/95 p-6 shadow-lg shadow-amber-100/30 backdrop-blur-sm dark:border-amber-700/40 dark:bg-slate-900/80 dark:shadow-none md:p-10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br from-amber-300/40 to-yellow-200/10 blur-2xl dark:from-amber-500/20 dark:to-yellow-400/5" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-amber-200/35 to-transparent blur-2xl dark:from-amber-400/20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/80 to-transparent dark:via-amber-500/40" />

      <div className="inline-flex items-center rounded-full border border-amber-300/70 bg-amber-50/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-amber-700 dark:border-amber-600/60 dark:bg-slate-800 dark:text-amber-300/80">
        WIjesinghe Jewelers
      </div>
      <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-amber-950 dark:text-amber-50 md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-amber-900/80 dark:text-amber-100/70 md:text-base">
        {subtitle}
      </p>
    </header>
  );
}
