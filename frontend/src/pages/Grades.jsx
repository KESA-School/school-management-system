import { useQuery } from '@tanstack/react-query';
import fetchWrapper from '../lib/api';
import useStore from '../store';
import { Link } from 'react-router-dom';

export default function Grades() {
  const { role } = useStore();
  const { data: grades, isLoading } = useQuery({
    queryKey: ['grades'],
    queryFn: () => fetchWrapper('/grades'),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">Grades</h1>
      {['admin', 'teacher'].includes(role) && (
        <Link
          to="/grades/new"
          className="p-2 bg-blue-500 text-white rounded mb-4 inline-block"
        >
          Add Grade
        </Link>
      )}
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Student ID</th>
            <th className="border p-2">Subject ID</th>
            <th className="border p-2">Class ID</th>
            <th className="border p-2">Score</th>
            <th className="border p-2">Comments</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {grades?.map((grade) => (
            <tr key={grade.id}>
              <td className="border p-2">{grade.student_id}</td>
              <td className="border p-2">{grade.subject_id}</td>
              <td className="border p-2">{grade.class_id}</td>
              <td className="border p-2">{grade.score}</td>
              <td className="border p-2">{grade.comments || 'N/A'}</td>
              <td className="border p-2">
                {['admin', 'teacher'].includes(role) && (
                  <Link
                    to={`/grades/${grade.id}/edit`}
                    className="text-blue-500"
                  >
                    Edit
                  </Link>
                )}
                {role === 'admin' && (
                  <button
                    onClick={() => handleDelete(grade.id)}
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
    if (window.confirm('Are you sure you want to delete this grade?')) {
      fetchWrapper(`/grades/${id}`, { method: 'DELETE' })
        .then(() => {
          queryClient.invalidateQueries(['grades']);
        })
        .catch((error) => alert(error.message));
    }
  }
}
