import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import fetchWrapper from '../lib/api';
import useStore from '../store';

export default function Timetable() {
  const { role } = useStore();
  const { data: timetable, isLoading } = useQuery({
    queryKey: ['timetables'],
    queryFn: () => fetchWrapper('/timetables'),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">Timetable</h1>
      {role === 'admin' && (
        <Link
          to="/timetables/new"
          className="p-2 bg-blue-500 text-white rounded mb-4 inline-block"
        >
          Add Timetable Entry
        </Link>
      )}
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Class</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Teacher</th>
            <th className="border p-2">Day</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {timetable?.map((entry) => (
            <tr key={entry.id}>
              <td className="border p-2">{entry.class_id}</td>
              <td className="border p-2">{entry.subject_id}</td>
              <td className="border p-2">{entry.teacher_id}</td>
              <td className="border p-2">{entry.day_of_week}</td>
              <td className="border p-2">
                {entry.start_time} - {entry.end_time}
              </td>
              <td className="border p-2">
                <Link to={`/timetables/${entry.id}`} className="text-blue-500">
                  View
                </Link>
                {role === 'admin' && (
                  <>
                    <Link
                      to={`/timetables/${entry.id}/edit`}
                      className="ml-2 text-blue-500"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(entry.id)}
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
    if (
      window.confirm('Are you sure you want to delete this timetable entry?')
    ) {
      fetchWrapper(`/timetables/${id}`, { method: 'DELETE' })
        .then(() => {
          queryClient.invalidateQueries(['timetables']);
        })
        .catch((error) => alert(error.message));
    }
  }
}
