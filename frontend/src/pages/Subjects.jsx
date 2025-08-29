import { useQuery } from '@tanstack/react-query';
import fetchWrapper from '../lib/api';
import useStore from '../store';
import { Link } from 'react-router-dom';

export default function Subjects() {
  const { role } = useStore();
  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => fetchWrapper('/subjects'),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">Subjects</h1>
      {role === 'admin' && (
        <Link
          to="/subjects/new"
          className="p-2 bg-blue-500 text-white rounded mb-4 inline-block"
        >
          Add Subject
        </Link>
      )}
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects?.map((subject) => (
            <tr key={subject.id}>
              <td className="border p-2">{subject.name}</td>
              <td className="border p-2">
                <Link to={`/subjects/${subject.id}`} className="text-blue-500">
                  View
                </Link>
                {role === 'admin' && (
                  <>
                    <Link
                      to={`/subjects/${subject.id}/edit`}
                      className="ml-2 text-blue-500"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(subject.id)}
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
    if (window.confirm('Are you sure you want to delete this subject?')) {
      fetchWrapper(`/subjects/${id}`, { method: 'DELETE' })
        .then(() => {
          queryClient.invalidateQueries(['subjects']);
        })
        .catch((error) => alert(error.message));
    }
  }
}
