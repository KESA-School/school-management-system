import { useQuery } from '@tanstack/react-query';
import fetchWrapper from '../lib/api';
import useStore from '../store';
import { Link } from 'react-router-dom';

export default function Classes() {
  const { role } = useStore();
  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => fetchWrapper('/classes'),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">Classes</h1>
      {role === 'admin' && (
        <Link
          to="/classes/new"
          className="p-2 bg-blue-500 text-white rounded mb-4 inline-block"
        >
          Add Class
        </Link>
      )}
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Teacher</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes?.map((cls) => (
            <tr key={cls.id}>
              <td className="border p-2">{cls.name}</td>
              <td className="border p-2">{cls.teacher_id || 'N/A'}</td>
              <td className="border p-2">
                <Link to={`/classes/${cls.id}`} className="text-blue-500">
                  View
                </Link>
                {role === 'admin' && (
                  <>
                    <Link
                      to={`/classes/${cls.id}/edit`}
                      className="ml-2 text-blue-500"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(cls.id)}
                      className="ml-2 text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this class?')) {
      fetchWrapper(`/classes/${id}`, { method: 'DELETE' })
        .then(() => {
          queryClient.invalidateQueries(['classes']);
        })
        .catch((error) => alert(error.message));
    }
  }
}
