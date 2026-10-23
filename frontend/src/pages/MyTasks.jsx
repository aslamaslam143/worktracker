import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Search } from 'lucide-react';
import api from '../services/api';

export default function MyTasks({ onEditTask, refreshTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter, refreshTrigger]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/tasks/', { params });
      setTasks(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this task record?')) {
      await api.delete(`/tasks/${id}/`);
      fetchTasks();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Tasks</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Manage all your daily work updates and history</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white dark:bg-[#181C24] border border-gray-300 dark:border-[#282F3E] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-[#181C24] border border-gray-300 dark:border-[#282F3E] rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="Yet to Start">Yet to Start</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white dark:bg-[#181C24] rounded-xl border border-gray-200 dark:border-[#282F3E]">
          No tasks found. Click "Add Daily Update" to record your work.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] rounded-xl p-4 flex flex-col justify-between hover:border-gray-400 dark:hover:border-gray-600 transition shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">
                    ID: {task.id.slice(0, 8)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEditTask(task)} className="text-gray-400 hover:text-blue-500">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-2 line-clamp-1">{task.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{task.description || 'No description provided.'}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#242A38] flex items-center justify-between text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-medium">{task.project_name}</span>
                <span className={`px-2 py-0.5 rounded-full font-medium ${
                  task.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                  task.status === 'In Progress' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                  'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                }`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}