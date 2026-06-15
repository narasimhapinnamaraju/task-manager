import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, loading }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl shadow-black/50 w-full max-w-sm overflow-hidden transform transition-all">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">
          <p className="text-sm text-slate-300">{message}</p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-400 shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
