// components/FormComponents.jsx — Reusable, styled form building blocks.
// Used by both CreatePortfolio and EditPortfolio to avoid repetition.

// ── Reusable labelled input ───────────────────────────────────────────────────
export const FormField = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
  </div>
);

// ── Common input style class string ──────────────────────────────────────────
export const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm';

// ── Read-only (disabled) input variant ───────────────────────────────────────
export const readonlyInputClass =
  'w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-100 dark:bg-gray-900 text-slate-500 dark:text-slate-500 text-sm cursor-not-allowed';

// ── Section heading with blue left border ────────────────────────────────────
export const SectionHeading = ({ children }) => (
  <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 pl-3 border-l-4 border-blue-500 mb-1">
    {children}
  </h3>
);
