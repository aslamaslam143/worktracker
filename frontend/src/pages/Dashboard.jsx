import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Hourglass, BarChart3 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import api from '../services/api';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Dashboard({ onOpenTask, refreshTrigger }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats/');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading dashboard...</div>;
  }

  const statCards = [
    { label: 'Total Tasks', value: stats?.total_tasks || 0, icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Completed', value: stats?.completed || 0, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'In Progress', value: stats?.in_progress || 0, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Pending', value: stats?.pending || 0, icon: Hourglass, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Total Hours', value: `${stats?.total_hours || 0} hrs`, icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Good Morning! 👋</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your work, stay productive and build your progress.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((sc, i) => {
          const Icon = sc.icon;
          return (
            <div key={i} className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] p-4 rounded-xl shadow-sm flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{sc.label}</span>
                <div className={`p-2 rounded-lg ${sc.bg} ${sc.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{sc.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] p-5 rounded-xl shadow-sm transition-colors">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Task Activity Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.daily_activity || []}>
                <XAxis dataKey="work_date" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', color: '#fff', borderRadius: '8px' }} />
                <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="in_progress" fill="#3B82F6" radius={[4, 4, 0, 0]} name="In Progress" />
                <Bar dataKey="pending" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] p-5 rounded-xl shadow-sm flex flex-col justify-between transition-colors">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Project-wise Distribution</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.projects_summary || []}
                  dataKey="count"
                  nameKey="project_name"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {(stats?.projects_summary || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', color: '#fff', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] p-5 rounded-xl shadow-sm transition-colors">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Work Updates</h3>
        <div className="space-y-3">
          {(stats?.recent_tasks || []).map((t) => (
            <div
              key={t.id}
              onClick={() => onOpenTask(t)}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-[#121620] hover:bg-gray-100 dark:hover:bg-[#1C2230] border border-gray-200 dark:border-[#222836] cursor-pointer transition"
            >
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{t.title}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{t.project_name}</span>
                  <span>•</span>
                  <span>{t.work_date}</span>
                  <span>•</span>
                  <span>{t.hours_worked} hrs</span>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                t.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                t.status === 'In Progress' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                'bg-amber-500/20 text-amber-600 dark:text-amber-400'
              }`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}