import { CheckCircle2, Info } from "lucide-react";

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900/95 px-4 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200">
      {toast.type === "success" ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
      ) : (
        <Info className="h-4 w-4 text-purple-400 flex-shrink-0" />
      )}
      <span>{toast.message}</span>
    </div>
  );
}

