import React, { useState, useEffect } from 'react';
import { Sheet, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function GoogleSheetsPage() {
  const [statusData, setStatusData] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/integrations/google-sheets/status/');
      setStatusData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const res = await api.post('/integrations/google-sheets/sync/');
      setMessage({ type: 'success', text: res.data.message });
      fetchStatus();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Sync failed.' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Google Sheets Integration</h2>
        <p className="text-xs text-gray-400">Sync all your task history automatically to Google Spreadsheet tabs</p>
      </div>

      <div className="bg-[#181C24] border border-[#282F3E] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#242A38]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Sheet size={24} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Spreadsheet Connection</h3>
              <p className="text-xs text-gray-400">{statusData?.message || 'Checking connection...'}</p>
            </div>
          </div>
          <div>
            {statusData?.connected ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full font-medium">
                <CheckCircle size={14} /> Connected
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full font-medium">
                <AlertCircle size={14} /> Not Configured
              </span>
            )}
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded text-xs ${
            message.type === 'success' ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-500/50' : 'bg-red-900/30 text-red-300 border border-red-500/50'
          }`}>
            {message.text}
          </div>
        )}

        <div className="pt-2 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {statusData?.last_sync ? `Last sync: ${new Date(statusData.last_sync.synced_at).toLocaleString()}` : 'Never synced yet.'}
          </p>
          <button
            onClick={handleSync}
            disabled={syncing || !statusData?.connected}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-medium transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>
    </div>
  );
}