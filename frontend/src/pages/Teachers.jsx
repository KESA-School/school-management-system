import { useQuery } from '@tanstack/react-query';
import fetchWrapper from '../lib/api';
import useStore from '../store';
import { Link } from 'react-router-dom';

export default function Teachers() {
  const { role } = useStore();
  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => fetchWrapper('/teachers'),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">Teachers</h1>
      {role === 'admin' && (
        <Link
          to="/teachers/new"
          className="p-2 bg-blue-500 text-white rounded mb-4 inline-block"
        >
          Add Teacher
        </Link>
      )}
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">First Name</th>
            <th className="border p-2">Last Name</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers?.map((teacher) => (
            <tr key={teacher.id}>
              <td className="border p-2">{teacher.first_name}</td>
              <td className="border p-2">{teacher.last_name}</td>
              <td className="border p-2">{teacher.subject_id || 'N/A'}</td>
              <td className="border p-2">
                <Link to={`/teachers/${teacher.id}`} className="text-blue-500">
                  View
                </Link>
                {role === 'admin' && (
                  <>
                    <Link
                      to={`/teachers/${teacher.id}/edit`}
                      className="ml-2 text-blue-500"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(teacher.id)}
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
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      fetchWrapper(`/teachers/${id}`, { method: 'DELETE' })
        .then(() => {
          queryClient.invalidateQueries(['teachers']);
        })
        .catch((error) => alert(error.message));
    }
  }
}
