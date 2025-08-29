import { useQuery } from '@tanstack/react-query';
import fetchWrapper from '../lib/api';
import useStore from '../store';

export default function AuditLogs() {
  const { role } = useStore();
  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit_logs'],
    queryFn: () => fetchWrapper('/audit-logs'),
  });

  if (role !== 'admin')
    return <div className="text-center mt-10 text-red-500">Unauthorized</div>;
  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Audit Logs</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">User ID</th>
            <th className="border p-2">Action</th>
            <th className="border p-2">Entity</th>
            <th className="border p-2">Entity ID</th>
            <th className="border p-2">Details</th>
            <th className="border p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs?.map((log) => (
            <tr key={log.id}>
              <td className="border p-2">{log.user_id}</td>
              <td className="border p-2">{log.action}</td>
              <td className="border p-2">{log.entity}</td>
              <td className="border p-2">{log.entity_id || 'N/A'}</td>
              <td className="border p-2">{JSON.stringify(log.details)}</td>
              <td className="border p-2">
                {new Date(log.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
