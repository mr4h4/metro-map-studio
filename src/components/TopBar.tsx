import type { ReactNode } from 'react';

export function Brand({ sub }: { sub: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-6 w-6 place-items-center rounded-[6px] bg-indigo-600 text-[13px] font-extrabold text-white">
        M
      </div>
      <span className="text-sm font-bold tracking-tight">Metro Studio</span>
      <span className="rounded-full border border-zinc-300 px-2 py-px text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        {sub}
      </span>
    </div>
  );
}

export default function TopBar({ left, right }: { left?: ReactNode; right: ReactNode }) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-3 dark:border-zinc-800 dark:bg-zinc-900">
      {left}
      <div className="ml-auto flex items-center gap-1.5">{right}</div>
    </header>
  );
}
