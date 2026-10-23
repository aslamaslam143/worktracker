import React, { useState, useRef } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import api from '../../services/api';

export default function TaskModal({ task, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    project_name: task?.project_name || '',
    work_date: task?.work_date || new Date().toISOString().split('T')[0],
    due_date: task?.due_date || '',
    status: task?.status || 'Yet to Start',
    priority: task?.priority || 'Medium',
    hours_worked: task?.hours_worked || 0.0,
    technologies: task?.technologies || '',
    description: task?.description || '',
    remarks: task?.remarks || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const workDateRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      due_date: formData.due_date || null,
      hours_worked: parseFloat(formData.hours_worked) || 0,
    };

    try {
      if (task?.id) {
        await api.patch(`/tasks/${task.id}/`, payload);
      } else {
        await api.post('/tasks/', payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#282F3E]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {task ? 'Edit Daily Task' : 'Add Daily Update'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-500/50 rounded text-red-600 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-sm">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Brain Selector Series Changes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#10131A] border border-gray-300 dark:border-[#282F3E] rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Project Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. OpenAtlas"
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#10131A] border border-gray-300 dark:border-[#282F3E] rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Work Date *</label>
              <div 
                onClick={() => workDateRef.current?.showPicker?.()} 
                className="relative flex items-center cursor-pointer"
              >
                <input
                  type="date"
                  ref={workDateRef}
                  required
                  value={formData.work_date}
                  onChange={(e) => setFormData({ ...formData, work_date: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#10131A] border border-gray-300 dark:border-[#282F3E] rounded-lg pl-3 pr-10 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                />
                <CalendarIcon size={16} className="absolute right-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#10131A] border border-gray-300 dark:border-[#282F3E] rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Yet to Start">Yet to Start</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#10131A] border border-gray-300 dark:border-[#282F3E] rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Hours Worked</label>
              <input
                type="number"
                step="0.25"
                min="0"
                value={formData.hours_worked}
                onChange={(e) => setFormData({ ...formData, hours_worked: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#10131A] border border-gray-300 dark:border-[#282F3E] rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Technologies Used</label>
              <input
                type="text"
                placeholder="React, Django, PostgreSQL"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#10131A] border border-gray-300 dark:border-[#282F3E] rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Add detailed description of your work..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#10131A] border border-gray-300 dark:border-[#282F3E] rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#282F3E]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-[#282F3E] hover:bg-gray-300 dark:hover:bg-[#343D50] text-gray-800 dark:text-gray-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md shadow-blue-600/30 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}