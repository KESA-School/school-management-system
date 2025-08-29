import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import fetchWrapper from '../lib/api';

export default function TeacherDetail() {
  const { id } = useParams();
  const { data: teacher, isLoading } = useQuery({
    queryKey: ['teacher', id],
    queryFn: () => fetchWrapper(`/teachers/${id}`),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">
        {teacher.first_name} {teacher.last_name}
      </h1>
      <p>User ID: {teacher.user_id}</p>
      <p>Subject ID: {teacher.subject_id || 'N/A'}</p>
    </div>
  );
}
