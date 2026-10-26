import React, { useState, useEffect } from 'react';
import { Download, FileSpreadsheet, BarChart3, CheckCircle2, Hourglass, Clock } from 'lucide-react';
import api from '../services/api';

export default function MonthlyReports() {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [year, month]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/monthly/?year=${year}&month=${month}`);
      setReport(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (url, filename) => {
    api.get(url, { responseType: 'blob' }).then((response) => {
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly Reports</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View, analyze and export your monthly work history.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] text-gray-900 dark:text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-500"
          >
            {[...Array(12).keys()].map((m) => (
              <option key={m + 1} value={m + 1}>
                {new Date(2000, m, 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] text-gray-900 dark:text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-500"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button
            onClick={() => downloadFile(`/reports/export/excel/?year=${year}&month=${month}`, `WorkTracker_${year}_${month}.xlsx`)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shadow-sm"
          >
            <FileSpreadsheet size={14} /> Export Excel
          </button>

          <button
            onClick={() => downloadFile(`/reports/export/csv/?year=${year}&month=${month}`, `WorkTracker_${year}_${month}.csv`)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shadow-sm"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading report...</div>
      ) : report ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] p-4 rounded-xl shadow-sm flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Tasks</span>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <BarChart3 size={16} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{report.total_tasks}</p>
            </div>

            <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] p-4 rounded-xl shadow-sm flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Completed</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <p className="text-2xl font-bold text-emerald-500 mt-3">{report.completed_tasks_count} ({report.completion_percentage}%)</p>
            </div>

            <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] p-4 rounded-xl shadow-sm flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Pending</span>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <Hourglass size={16} />
                </div>
              </div>
              <p className="text-2xl font-bold text-amber-500 mt-3">{report.pending_tasks_count}</p>
            </div>

            <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] p-4 rounded-xl shadow-sm flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Hours</span>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Clock size={16} />
                </div>
              </div>
              <p className="text-2xl font-bold text-purple-400 mt-3">{report.total_hours} hrs</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#181C24] border border-gray-200 dark:border-[#282F3E] rounded-xl p-5 shadow-sm transition-colors">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Project Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-[#121620] text-gray-500 dark:text-gray-400 uppercase">
                  <tr>
                    <th className="p-3">Project Name</th>
                    <th className="p-3">Tasks</th>
                    <th className="p-3">Completed</th>
                    <th className="p-3">Total Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#242A38]">
                  {report.project_summary?.map((p, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-[#1C2230] transition">
                      <td className="p-3 font-medium text-gray-900 dark:text-white">{p.project_name}</td>
                      <td className="p-3">{p.total_tasks}</td>
                      <td className="p-3 text-emerald-500">{p.completed_tasks}</td>
                      <td className="p-3">{p.total_hours} hrs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}