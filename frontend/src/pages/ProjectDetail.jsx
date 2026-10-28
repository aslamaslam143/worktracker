
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, CheckCircle2, Clock, Trash2, Edit2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import ConfirmModal from '../components/common/ConfirmModal';

export default function ProjectDetail({ onOpenTask, refreshTrigger }) {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const decodedProjectName = decodeURIComponent(projectName);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchProjectTasks();
  }, [decodedProjectName, statusFilter, refreshTrigger]);

  const fetchProjectTasks = async () => {
    try {
      setLoading(true);
      const params = { project_name: decodedProjectName };
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/tasks/', { params });
      setTasks(res.data.results || res.data);
    } catch (err) {
      console.error('Error fetching project tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchProjectTasks();
    } catch (err) {
      console.error('Status update failed:', err);
      toast.error('Failed to update status');
    }
  };

  const handleOpenDelete = (task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/tasks/${taskToDelete.id}/`);
      toast.success('Task deleted successfully');
      setDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchProjectTasks();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete task');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const totalHours = tasks.reduce((acc, t) => acc + (parseFloat(t.hours_worked) || 0), 0);

  return (
    <div className="space-y-6 w-full">
      {/* Top Navigation & Project Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-[#282F3E] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-white dark:bg-[#1C2230] border border-gray-200 dark:border-[#2B3446] text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500"></span>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{decodedProjectName}</h1>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Project Task Management & Progress Updates
            </p>
          </div>
        </div>

        {/* Add Task specifically to this project */}
        <button
          onClick={() => onOpenTask({ project_name: decodedProjectName })}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          Add Task to {decodedProjectName}
        </button>
      </div>

      {/* Project KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] p-4 rounded-xl shadow-sm">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Tasks</span>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalTasks}</p>
        </div>
        <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] p-4 rounded-xl shadow-sm">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 size={14} /> Completed
          </span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{completedCount}</p>
        </div>
        <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] p-4 rounded-xl shadow-sm">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
            <Clock size={14} /> In Progress
          </span>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{inProgressCount}</p>
        </div>
        <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] p-4 rounded-xl shadow-sm">
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Total Hours Worked</span>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{totalHours.toFixed(1)} hrs</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#282F3E] pb-2 text-xs">
        {['', 'Yet to Start', 'In Progress', 'Pending', 'Completed'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              statusFilter === st
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1C2230]'
            }`}
          >
            {st || 'All Tasks'}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="py-12 text-center text-gray-500 text-xs">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#181C24] rounded-xl border border-gray-200 dark:border-[#282F3E]">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks in this project yet.</p>
          <button
            onClick={() => onOpenTask({ project_name: decodedProjectName })}
            className="mt-3 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:underline cursor-pointer"
          >
            + Create First Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-gray-400 dark:hover:border-gray-600 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gray-400">ID: {task.id.slice(0, 8)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenTask(task)}
                      className="text-gray-400 hover:text-blue-500 cursor-pointer"
                      title="Edit Task"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(task)}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                      title="Delete Task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-2">{task.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {task.description || 'No description provided.'}
                </p>
                {task.technologies && (
                  <p className="text-[11px] text-blue-500 dark:text-blue-400 mt-2">
                    🛠 {task.technologies}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#242A38] flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  {task.work_date} • {task.hours_worked || '0.00'} hrs
                </span>
                
                {/* Instant Status Selector */}
                <select
                  value={task.status}
                  onChange={(e) => handleQuickStatusChange(task.id, e.target.value)}
                  className={`px-2 py-0.5 rounded text-xs font-semibold bg-transparent border border-gray-300 dark:border-gray-700 cursor-pointer ${
                    task.status === 'Completed'
                      ? 'text-emerald-500'
                      : task.status === 'In Progress'
                      ? 'text-blue-500'
                      : 'text-amber-500'
                  }`}
                >
                  <option value="Yet to Start">Yet to Start</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dark Confirmation Modal matching MyTasks */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete task?"
        description={`This will permanently delete "${taskToDelete?.title || 'this task'}". This action cannot be undone.`}
        confirmText="Delete task"
        cancelText="Cancel"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
      />
    </div>
  );
}