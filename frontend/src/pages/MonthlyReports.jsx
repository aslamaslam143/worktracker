import React, { useState, useEffect } from 'react';
import { Download, FileSpreadsheet, Printer } from 'lucide-react';
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Monthly Reports</h2>
          <p className="text-xs text-gray-400">View, analyze and export your monthly work history</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-[#181C24] border border-[#282F3E] rounded-lg px-3 py-1.5 text-xs text-white"
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
            className="bg-[#181C24] border border-[#282F3E] rounded-lg px-3 py-1.5 text-xs text-white"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button
            onClick={() => downloadFile(`/reports/export/excel/?year=${year}&month=${month}`, `WorkTracker_${year}_${month}.xlsx`)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
          >
            <FileSpreadsheet size={14} /> Export Excel
          </button>

          <button
            onClick={() => downloadFile(`/reports/export/csv/?year=${year}&month=${month}`, `WorkTracker_${year}_${month}.csv`)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading report...</div>
      ) : report ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#181C24] border border-[#282F3E] p-4 rounded-xl">
              <span className="text-xs text-gray-400">Total Tasks</span>
              <p className="text-2xl font-bold text-white mt-1">{report.total_tasks}</p>
            </div>
            <div className="bg-[#181C24] border border-[#282F3E] p-4 rounded-xl">
              <span className="text-xs text-gray-400">Completed</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{report.completed_tasks_count} ({report.completion_percentage}%)</p>
            </div>
            <div className="bg-[#181C24] border border-[#282F3E] p-4 rounded-xl">
              <span className="text-xs text-gray-400">Pending</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{report.pending_tasks_count}</p>
            </div>
            <div className="bg-[#181C24] border border-[#282F3E] p-4 rounded-xl">
              <span className="text-xs text-gray-400">Total Hours</span>
              <p className="text-2xl font-bold text-blue-400 mt-1">{report.total_hours} hrs</p>
            </div>
          </div>

          <div className="bg-[#181C24] border border-[#282F3E] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Project Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#121620] text-gray-400 uppercase">
                  <tr>
                    <th className="p-3">Project Name</th>
                    <th className="p-3">Tasks</th>
                    <th className="p-3">Completed</th>
                    <th className="p-3">Total Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#242A38]">
                  {report.project_summary.map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#1C2230]">
                      <td className="p-3 font-medium text-white">{p.project_name}</td>
                      <td className="p-3">{p.total_tasks}</td>
                      <td className="p-3 text-emerald-400">{p.completed_tasks}</td>
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