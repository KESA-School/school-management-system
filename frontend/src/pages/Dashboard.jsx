import { useQuery } from '@tanstack/react-query';
import fetchWrapper from '../lib/api';
import useStore from '../store';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { role } = useStore();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const [students, teachers, classes, announcements] = await Promise.all([
        fetchWrapper('/students'),
        fetchWrapper('/teachers'),
        fetchWrapper('/classes'),
        fetchWrapper('/announcements'),
      ]);
      return {
        studentCount: students.length,
        teacherCount: teachers.length,
        classCount: classes.length,
        announcementCount: announcements.length,
      };
    },
  });

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Students</h2>
          <p className="text-2xl">{stats.studentCount}</p>
          <Link to="/students" className="text-blue-500 hover:underline">
            View Students
          </Link>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Teachers</h2>
          <p className="text-2xl">{stats.teacherCount}</p>
          <Link to="/teachers" className="text-blue-500 hover:underline">
            View Teachers
          </Link>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Classes</h2>
          <p className="text-2xl">{stats.classCount}</p>
          <Link to="/classes" className="text-blue-500 hover:underline">
            View Classes
          </Link>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Announcements</h2>
          <p className="text-2xl">{stats.announcementCount}</p>
          <Link to="/announcements" className="text-blue-500 hover:underline">
            View Announcements
          </Link>
        </div>
      </div>
      {role === 'admin' && (
        <div className="mt-6">
          <Link to="/audit-logs" className="p-2 bg-blue-500 text-white rounded">
            View Audit Logs
          </Link>
        </div>
      )}
    </div>
  );
}
