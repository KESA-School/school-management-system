import { useQuery } from '@tanstack/react-query';
import fetchWrapper from '../lib/api';
import useStore from '../store';
import { Link } from 'react-router-dom';

export default function Announcements() {
  const { role, user } = useStore();
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => fetchWrapper('/announcements'),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">Announcements</h1>
      {['admin', 'teacher'].includes(role) && (
        <Link
          to="/announcements/new"
          className="p-2 bg-blue-500 text-white rounded mb-4 inline-block"
        >
          Add Announcement
        </Link>
      )}
      <div className="space-y-4">
        {announcements?.map((announcement) => (
          <div key={announcement.id} className="border p-4 rounded">
            <h2 className="text-xl">{announcement.title}</h2>
            <p>{announcement.content}</p>
            <p className="text-sm text-gray-500">
              Posted by: {announcement.created_by}
            </p>
            {['admin', 'teacher'].includes(role) && (
              <div>
                <Link
                  to={`/announcements/${announcement.id}/edit`}
                  className="text-blue-500"
                >
                  Edit
                </Link>
                {role === 'admin' && (
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="ml-2 text-red-500"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      fetchWrapper(`/announcements/${id}`, { method: 'DELETE' })
        .then(() => {
          queryClient.invalidateQueries(['announcements']);
        })
        .catch((error) => alert(error.message));
    }
  }
}
