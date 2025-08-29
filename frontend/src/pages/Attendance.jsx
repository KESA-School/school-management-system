import { useQuery } from '@tanstack/react-query';
import fetchWrapper from '../lib/api';
import useStore from '../store';
import { Link } from 'react-router-dom';

export default function Attendance() {
  const { role } = useStore();
  const { data: attendance, isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: () => fetchWrapper('/attendance'),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">Attendance</h1>
      {['admin', 'teacher'].includes(role) && (
        <Link
          to="/attendance/new"
          className="p-2 bg-blue-500 text-white rounded mb-4 inline-block"
        >
          Add Attendance
        </Link>
      )}
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Student ID</th>
            <th className="border p-2">Class ID</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendance?.map((record) => (
            <tr key={record.id}>
              <td className="border p-2">{record.student_id}</td>
              <td className="border p-2">{record.class_id}</td>
              <td className="border p-2">{record.date}</td>
              <td className="border p-2">{record.status}</td>
              <td className="border p-2">
                {['admin', 'teacher'].includes(role) && (
                  <Link
                    to={`/attendance/${record.id}/edit`}
                    className="text-blue-500"
                  >
                    Edit
                  </Link>
                )}
                {role === 'admin' && (
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="ml-2 text-red-500"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function handleDelete(id) {
    if (
      window.confirm('Are you sure you want to delete this attendance record?')
    ) {
      fetchWrapper(`/attendance/${id}`, { method: 'DELETE' })
        .then(() => {
          queryClient.invalidateQueries(['attendance']);
        })
        .catch((error) => alert(error.message));
    }
  }
}
