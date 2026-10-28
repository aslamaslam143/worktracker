import React from 'react';
import { X } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  title = "Delete task?", 
  description = "This will permanently delete this task record. This can't be undone.", 
  confirmText = "Delete", 
  cancelText = "Cancel", 
  onConfirm, 
  onClose,
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div 
        className="bg-[#181C24] border border-[#282F3E] rounded-2xl w-full max-w-sm p-5 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close X */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white tracking-wide">
            {title}
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-200 transition p-1 rounded-lg hover:bg-[#282F3E] cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Description text */}
        <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 mt-5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-transparent hover:bg-[#282F3E] border border-gray-600/50 text-gray-200 text-xs font-medium transition cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-400 hover:text-red-300 text-xs font-medium transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}