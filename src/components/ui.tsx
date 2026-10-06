import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'danger';

const base =
  'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors select-none';
const sizes = {
  sm: 'h-7 px-2.5 text-xs',
  md: 'h-8 px-3 text-[13px]',
} as const;
const variants: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700',
  ghost:
    'border border-zinc-300 bg-white text-zinc-700 hover:border-indigo-400 hover:text-indigo-700 ' +
    'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300',
  danger:
    'border border-zinc-300 bg-white text-red-700 hover:border-red-400 hover:bg-red-50 ' +
    'dark:border-zinc-700 dark:bg-zinc-900 dark:text-red-400 dark:hover:border-red-500',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: keyof typeof sizes;
  block?: boolean;
}

export function Button({ variant = 'ghost', size = 'md', block, className = '', ...rest }: ButtonProps) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    />
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
      {children}
    </h3>
  );
}

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400"
    >
      {children}
    </label>
  );
}

export const inputCls =
  'h-8 w-full rounded-md border border-zinc-300 bg-white px-2 text-[13px] text-zinc-900 outline-none ' +
  'focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100';
