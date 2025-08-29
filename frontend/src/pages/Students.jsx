import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import fetchWrapper from '../lib/api';
import useStore from '../store';

export default function Students() {
  const { role } = useStore();
  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => fetchWrapper('/students'),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">Students</h1>
      {role === 'admin' && (
        <Link
          to="/students/new"
          className="p-2 bg-blue-500 text-white rounded mb-4 inline-block"
        >
          Add Student
        </Link>
      )}
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">First Name</th>
            <th className="border p-2">Last Name</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((student) => (
            <tr key={student.id}>
              <td className="border p-2">{student.first_name}</td>
              <td className="border p-2">{student.last_name}</td>
              <td className="border p-2">
                <Link to={`/students/${student.id}`} className="text-blue-500">
                  View
                </Link>
                {role === 'admin' && (
                  <>
                    <Link
                      to={`/students/${student.id}/edit`}
                      className="ml-2 text-blue-500"
                    >
                      Edit
                    </Link>
                    <button className="ml-2 text-red-500">Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
